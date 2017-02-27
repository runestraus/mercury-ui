import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { MeService } from './me.service';
import { User } from '../model/user.model';

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
          this.meService.get().then( data =>
            this.loginEvent.next(data)
          ).catch(this.handleError);
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

  logOut() {
    // hack to sign out from google oauth
    const revokeTokenEndpoint = 'https://accounts.google.com/o/oauth2/revoke?token';
    const iframe = document.createElement('iframe');

    iframe.setAttribute('src', `${revokeTokenEndpoint}=${this.oauthService.getAccessToken()}`);
    iframe.setAttribute('class', 'hide');
    iframe.setAttribute('id', 'google-redirect');
    document.body.appendChild(iframe);
    this.oauthService.logOut();
  }

  private handleError(error: any) {
    this.logOut();
    this.loginEvent.error(error);
  }
}
