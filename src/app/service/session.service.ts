import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { MeService } from './me.service';
import { User } from '../model/user.model';
import { Profile } from '../model/profile.model';

@Injectable()
export class SessionService {

  private loginEvent = new Subject<User>();

  constructor(private oauthService: OAuthService, private meService: MeService) { }

  initialize() {
    this.oauthService.redirectUri = window.location.origin;

    this.oauthService.clientId = environment.clientId;
    this.oauthService.oidc = true;
    this.oauthService.scope = 'https://www.googleapis.com/auth/userinfo.profile ' +
      'https://www.googleapis.com/auth/userinfo.email openid email profile';

    this.oauthService.issuer = 'https://accounts.google.com';

    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin({
        onTokenReceived: () => {
          this.meService.get()
            .then(data => {
              this.loginEvent.next(data);
            })
            .catch(err => {
              this.oauthService.logOut();
              this.loginEvent.error(err);
            });
        }
      });
    });
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  initOauthFlow() {
    this.oauthService.initImplicitFlow();
  }

  loginObservable() {
    return this.loginEvent.asObservable();
  }

  getUserProfile(): Profile {
    return JSON.parse(localStorage.getItem('id_token_claims_obj')) as Profile;
  }

  logOut(): Promise<any> {
    return this.meService.logout()
      .then(() => this.oauthService.logOut())
      .catch(() => {
        // swallow error and log out locally
        this.oauthService.logOut();
      });
  }
}
