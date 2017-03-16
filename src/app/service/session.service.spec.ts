/* tslint:disable:no-unused-variable */
import { TestBed, inject, async } from '@angular/core/testing';
import { SessionService } from './session.service';
import { MeService } from './me.service';
import { User } from '../model/user.model';
import { GoogleOauthService } from './google-oauth.service';

describe('SessionService', () => {
  let sessionService;
  let oAuthService;
  const mockOAuthService = {
    hasValidAccessToken: jasmine.createSpy('oauthService.hasValidAccessToken'),
    tryLogin: jasmine.createSpy('oauthService.tryLogin'),
    loadDiscoveryDocument: jasmine.createSpy('oauthService.loadDiscoveryDocument'),
    signOut: jasmine.createSpy('oauthService.logOut'),
    getProfile: jasmine.createSpy('oauthService.getProfile'),
    onSignedIn: jasmine.createSpy('oauthService.onSignedIn')
  };

  const mockMeService = {
    get: jasmine.createSpy('get'),
    logout: jasmine.createSpy('logout')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        { provide: GoogleOauthService, useValue: mockOAuthService },
        { provide: MeService, useValue: mockMeService }
      ]
    });
  });

  beforeEach(inject([SessionService, GoogleOauthService], (_sessionService, _oauthService) => {
    sessionService = _sessionService;
    oAuthService = _oauthService;
  }));

  it('logOut() should call logout on meService then logout from oauthService', async(() => {
    mockMeService.logout.and.returnValue(Promise.resolve(new User()));

    sessionService.signOut().then(() => {
      expect(mockMeService.logout).toHaveBeenCalled();
      expect(mockOAuthService.signOut).toHaveBeenCalled();
    });
  }));

  it('should load the user profile from localstorage', () => {
    oAuthService.getProfile.and.returnValue({
      getName: () => 'John Donuts',
      getEmail: () => 'john@donuts.email',
      getImageUrl: () => 'someImageUrl'
    });
    const profile = sessionService.getUserProfile();

    expect(profile.getName()).toBe('John Donuts');
    expect(profile.getEmail()).toBe('john@donuts.email');
    expect(profile.getImageUrl()).toBe('someImageUrl');
  });
});

