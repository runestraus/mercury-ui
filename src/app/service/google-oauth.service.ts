import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthResponse, GoogleAuthCurrentUser, GoogleProfile } from '../model/profile.model';
import { GapiLoader } from './gapi-loader.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/timeInterval';

@Injectable()
export class GoogleOauthService {

  private _scope: string = 'https://www.googleapis.com/auth/userinfo.profile ' +
    'https://www.googleapis.com/auth/userinfo.email openid email profile';
  private _googleAuth: GoogleAuthResponse;
  private _accessToken: string;
  private autoSignInTimer: Subscription;
  private _profile: GoogleProfile;
  private _successfulSignInObserver: Subject<GoogleProfile> = new Subject();
  private _signedOutObserver: Subject<void> = new Subject<void>();

  constructor(private zone: NgZone,
              private gapiLoader: GapiLoader) {
    this.loadAuth();
  }

  loadAuth() {
    this.gapiLoader
      .load('auth2')
      .switchMap(() => this.authorize())
      .do((googleAuth: GoogleAuthResponse) => this.saveGoogleAuth(googleAuth))
      .do((googleAuth: GoogleAuthResponse) => this.listenToGoogleAuthSignIn(googleAuth))
      .filter((googleAuth: GoogleAuthResponse) => this.isSignedIn())
      .filter((googleAuth: GoogleAuthResponse) => this.hasAccessToken(googleAuth))
      .map((googleAuth: GoogleAuthResponse) => googleAuth.currentUser.get())
      .subscribe((googleUser: GoogleAuthCurrentUser) => {
        this.zone.run(() => this.handleSuccessLogin(googleUser));
      });
  }

  authorize() {
    const authOptions = {
      client_id: environment.clientId,
      scope: this._scope,
      prompt: 'select_account',
      redirect_uri: window.location.origin,
      ux_mode: 'redirect'
    };
    return Observable.fromPromise(window['gapi'].auth2.init(authOptions));
  }

  private hasAccessToken (googleAuth: GoogleAuthResponse): boolean {
    return googleAuth && googleAuth.currentUser.get().getAuthResponse().hasOwnProperty('access_token');
  }

  private saveGoogleAuth (googleAuth: GoogleAuthResponse): GoogleAuthResponse {
    this._googleAuth = googleAuth;
    return googleAuth;
  }

  private listenToGoogleAuthSignIn (googleAuth: GoogleAuthResponse) {
    window['gapi']['auth2'].getAuthInstance().isSignedIn.listen(authState => {
      switch (authState) {

        case false:
          this.zone.run(() => this._signedOutObserver.next());
          break;

        default:
      }
    });
  }

  signIn() {
    const signOptions = {
      scope: this._scope,
      prompt: 'select_account',
      redirect_uri: window.location.origin,
      ux_mode: 'redirect'
    };
    if (this._googleAuth) {
      this._googleAuth.signIn(signOptions);
    }
  }

  handleSuccessLogin(googleUser: GoogleAuthCurrentUser) {
    const authResponse = googleUser.getAuthResponse();
    const token = authResponse.access_token;
    const profile = googleUser.getBasicProfile();
    const MILLISECOND = 1000;
    const seconds: string = authResponse.expires_in;
    const expireTimeInMs = parseInt(seconds, 10) * MILLISECOND;
    this._profile = profile;
    this._accessToken = token;
    this._successfulSignInObserver.next(profile);
    if (this.autoSignInTimer) {
      this.autoSignInTimer.unsubscribe();
    }
    this.autoSignInTimer = this.startTimerToNextAuth(expireTimeInMs);
  }

  startTimerToNextAuth(timeInMs: number): Subscription {
    return Observable.timer(timeInMs)
      .timeInterval()
      .switchMap(() => this.authorize())
      .do((googleAuth: GoogleAuthResponse) => this.saveGoogleAuth(googleAuth))
      .map((googleAuth: GoogleAuthResponse) => googleAuth.currentUser.get())
      .subscribe((googleUser: GoogleAuthCurrentUser) => {
        this.zone.run(() => this.handleSuccessLogin(googleUser));
      });
  }

  isSignedIn() {
    return this._googleAuth && this._googleAuth.isSignedIn.get();
  }

  signOut(): Promise<any> {
    if (this.autoSignInTimer) {
      this.autoSignInTimer.unsubscribe();
    }
    return Observable.fromPromise(this._googleAuth.signOut()).toPromise();
  }

  getAccessToken(): string {
    return this.zone.run(() => {
      return this._accessToken;
    });
  }

  getProfile(): GoogleProfile {
    return this.zone.run(() => {
      return this._profile;
    });
  }

  onSignedIn(fn: (Profile) => void): Subscription {
    return this._successfulSignInObserver.subscribe(fn);
  }

  onSignedOut(fn: () => void): Subscription {
    return this._signedOutObserver.subscribe(fn);
  }
}
