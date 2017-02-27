/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { SessionService } from './session.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { MeService } from './me.service';
import { Observable } from 'rxjs/Observable';

describe('SessionService', () => {
  let sessionService;
  let oAuthService;
  const mockOAuthService = {
    loginUrl: '',
    redirectUri: '',
    clientId: '',
    scope: '',
    hasValidAccessToken: jasmine.createSpy('hasValidAccessToken'),
    tryLogin: jasmine.createSpy('tryLogin'),
    loadDiscoveryDocument: jasmine.createSpy('loadDiscoveryDocument')
  };

  const mockMeService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        { provide: OAuthService, useValue: mockOAuthService },
        { provide: MeService, useValue: mockMeService }
      ]
    });
  });

  beforeEach(inject([SessionService, OAuthService], (_sessionService, _oauthService) => {
    sessionService = _sessionService;
    oAuthService = _oauthService;
  }));

  it('initialize() should setup and tryLogin', () => {
    mockOAuthService.loadDiscoveryDocument.and.returnValue(Observable.from('nothing').toPromise());
    sessionService.initialize();

    expect(oAuthService.redirectUri).toBeDefined();
    expect(oAuthService.clientId).toBe(environment.clientId);
    expect(oAuthService.scope)
      .toBe('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid email profile');
    expect(mockOAuthService.loadDiscoveryDocument).toHaveBeenCalled();
  });

  it('isLoggedIn() should call hasValidAccessToken and return false', () => {
    mockOAuthService.hasValidAccessToken.and.returnValue(false);
    expect(sessionService.isLoggedIn()).toBeFalsy();
    expect(mockOAuthService.hasValidAccessToken).toHaveBeenCalled();
  });

  it('isLoggedIn() should call hasValidAccessToken and return true', () => {
    mockOAuthService.hasValidAccessToken.and.returnValue(true);
    expect(sessionService.isLoggedIn()).toBeTruthy();
    expect(mockOAuthService.hasValidAccessToken).toHaveBeenCalled();
  });
});

