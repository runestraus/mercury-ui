export function mockGoogleService(): any {
  return {
      loadAuth: jasmine.createSpy('loadAuth'),
      authorize: jasmine.createSpy('authorize'),
      signIn: jasmine.createSpy('signIn'),
      handleSuccessLogin: jasmine.createSpy('handleSuccessLogin'),
      startTimerToNextAuth: jasmine.createSpy('startTimerToNextAuth'),
      isSignedIn: jasmine.createSpy('isSignedIn'),
      signOut: jasmine.createSpy('signOut'),
      getAccessToken: jasmine.createSpy('getAccessToken'),
      getProfile: jasmine.createSpy('getProfile'),
      onSignedIn: jasmine.createSpy('onSignedIn'),
      onSignedOut: jasmine.createSpy('onSignedOut'),
    };
}
