import { Injectable } from '@angular/core';
import { MeService } from './me.service';
import { GoogleOauthService } from './google-oauth.service';
import { UserData, GoogleProfile, Profile } from '../model/profile.model';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SessionService {
  static readonly CURRENT_USER = 'CURRENT_USER';
  private _signInObserver: Subject<UserData> = new Subject<UserData>();
  private _signedOutObserver:  Subject<void> = new Subject<void>();
  private _signInFailedObserver: Subject<Error> = new Subject<Error>();

  constructor(private meService: MeService, private googleService: GoogleOauthService) { }

  initialize() {
    this.googleService.onSignedIn(profile => {
      localStorage.setItem('access_token', this.googleService.getAccessToken());
      this.meService.get()
        .then(data => {
          const user = {
            user: data,
            profile: {
              id: profile.getId(),
              name: profile.getName(),
              givenName: profile.getGivenName(),
              familyName: profile.getFamilyName(),
              imageUrl: profile.getImageUrl(),
              email: profile.getEmail()
            } as Profile
          } as UserData;
          localStorage.setItem(SessionService.CURRENT_USER, JSON.stringify(user));
          this._signInObserver.next(user);
        })
        .catch(err => {
          this._signInFailedObserver.next(err);
        });
    });
    this.googleService.onSignedOut(() => {
      localStorage.clear();
      this._signedOutObserver.next();
    });
  }

  tryGetCurrentUser(): UserData {
    const localUser = localStorage.getItem(SessionService.CURRENT_USER);
    if (localUser) {
      return JSON.parse(localUser);
    }
    return null;
  }

  getAccessToken(): string {
    return this.googleService.getAccessToken();
  }

  signIn() {
    return this.googleService.signIn();
  }

  onSignIn(fn: (user: UserData) => void): Subscription {
    return this._signInObserver.subscribe(fn);
  }

  onSignedOut(fn: () => void): Subscription {
    return this._signedOutObserver.subscribe(fn);
  }

  onSignInFailure(fn: () => void): Subscription {
    return this._signInFailedObserver.subscribe(fn);
  }

  getUserProfile(): GoogleProfile {
    return this.googleService.getProfile();
  }

  signOut(): Promise<any> {
    return this.googleService.signOut()
      .then(() => this._signedOutObserver.next());
  }
}
