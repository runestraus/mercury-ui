/* tslint:disable:no-unused-variable */
import { TestBed, inject, async } from '@angular/core/testing';
import { SessionService } from './session.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { MeService } from './me.service';
import { User } from '../model/user.model';

describe('SessionService', () => {
  let sessionService;
  let oAuthService;
  const mockOAuthService = {
    loginUrl: '',
    redirectUri: '',
    clientId: '',
    scope: '',
    hasValidAccessToken: jasmine.createSpy('oauthService.hasValidAccessToken'),
    tryLogin: jasmine.createSpy('oauthService.tryLogin'),
    loadDiscoveryDocument: jasmine.createSpy('oauthService.loadDiscoveryDocument'),
    logOut: jasmine.createSpy('oauthService.logOut')
  };

  const mockMeService = {
    get: jasmine.createSpy('get'),
    logout: jasmine.createSpy('logout')
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
    mockOAuthService.loadDiscoveryDocument.and.returnValue(Promise.resolve('nothing'));
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

  it('logOut() should call logout on meService then logout from oauthService', async(() => {
    mockMeService.logout.and.returnValue(Promise.resolve(new User()));

    sessionService.logOut().then(() => {
      expect(mockMeService.logout).toHaveBeenCalled();
      expect(mockOAuthService.logOut).toHaveBeenCalled();
    });
  }));

  it('should load the user profile from localstorage', () => {
    localStorage.setItem('id_token_claims_obj', '{"name":"John Donuts", "email":"john@donuts.email", "picture":"someImageUrl"}');
    const profile = sessionService.getUserProfile();

    expect(profile.name).toBe('John Donuts');
    expect(profile.email).toBe('john@donuts.email');
    expect(profile.picture).toBe('someImageUrl');
  });
});

