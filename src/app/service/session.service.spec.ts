/* tslint:disable:no-unused-variable */
import { TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing';
import { SessionService } from './session.service';
import { MeService } from './me.service';
import { User } from '../model/user.model';
import { GoogleOauthService } from './google-oauth.service';

describe('SessionService', () => {
  let sessionService;
  let oAuthService;
  let meService;
  const mockOAuthService = {
    hasValidAccessToken: jasmine.createSpy('oauthService.hasValidAccessToken'),
    tryLogin: jasmine.createSpy('oauthService.tryLogin'),
    loadDiscoveryDocument: jasmine.createSpy('oauthService.loadDiscoveryDocument'),
    signOut: jasmine.createSpy('oauthService.logOut'),
    getProfile: jasmine.createSpy('oauthService.getProfile'),
    onSignedIn: jasmine.createSpy('oauthService.onSignedIn'),
    onSignedOut: jasmine.createSpy('oauthService.onSignedOut'),
    getAccessToken: jasmine.createSpy('oauthService.getAccessToken')
  };

  const mockMeService = {
    get: jasmine.createSpy('get'),
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

  beforeEach(inject([SessionService, GoogleOauthService, MeService], (_sessionService, _oauthService, _meService) => {
    sessionService = _sessionService;
    oAuthService = _oauthService;
    meService = _meService;
  }));

  afterEach(() => {
    localStorage.clear();
  });

  it('logOut() should call logout on meService then logout from oauthService', done => {
    mockOAuthService.signOut.and.returnValue(Promise.resolve());

    sessionService.signOut().then(() => {
      expect(mockOAuthService.signOut).toHaveBeenCalled();
      done();
    });
  });

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

  it('should return the previously logged in user', () => {
    const currentUser = {
      profile: {
        id: '1234',
        name: 'Russell Wilson',
        givenName: 'Russell',
        familyName: 'Wilson',
        imageUrl: 'something.google.com',
        email: 'russell@wilson.email'
      },
      user: {}
    };
    localStorage.setItem(SessionService.CURRENT_USER, JSON.stringify(currentUser));

    const result = sessionService.tryGetCurrentUser();

    expect(result.profile.id).toBe(currentUser.profile.id);
    expect(result.profile.name).toBe(currentUser.profile.name);
  });

  it('should return null when user does not exist in local storage', () => {
    const result = sessionService.tryGetCurrentUser();

    expect(result).toBeNull();
  });

  it('should clear localstorage on signout', () => {
    oAuthService.onSignedOut.and.callFake((fn: any) => {
      fn();
    });
    localStorage.setItem('testItem', 'it is a test');
    expect(localStorage.length).toBe(1);
    sessionService.initialize();

    expect(localStorage.length).toBe(0);
  });

  it('should set the user in localstorage when signed in', done => {
    meService.get.and.returnValue(Promise.resolve(new User()));
    oAuthService.getAccessToken.and.returnValue('abc123');
    oAuthService.onSignedIn.and.callFake((fn: any) => {
      fn({
        getId: () =>  '1234',
        getName: () =>  'Russell Wilson',
        getGivenName: () =>  'Russell',
        getFamilyName: () =>  'Wilson',
        getImageUrl: () =>  'something.google.com',
        getEmail: () =>  'russell@wilson.email'
      });
    });
    sessionService.onSignIn(user => {
      expect(meService.get).toHaveBeenCalled();
      expect(user.profile.id).toBe('1234');
      expect(user.profile.name).toBe('Russell Wilson');
      done();
    });

    sessionService.initialize();
  });
});

