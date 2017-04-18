import { XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {
  fakeAsync, tick, TestBed, ComponentFixture
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../app.module';
import { AppComponent } from '../app.component';
import { DocQuery } from '../shared/testutils';
import { mockGoogleService } from './mocks';
import { MockServer } from './server.mock';
import { GoogleOauthService } from '../service/google-oauth.service';
import { LoginLogoutPage } from './pages/login-logout.po';
import * as testusers from './testdata/testusers';

class Page {
  query: DocQuery<AppComponent>;

  constructor(
      private fixture: ComponentFixture<AppComponent>) {
    this.query = new DocQuery(fixture);
  }

  isDashboard(): boolean {
    const el = this.query.getElementByCss('#dashboard');
    return el != null;
  }
}

describe('login/logout', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginLogoutPage: LoginLogoutPage;
  let page: Page;

  let googleService: any;
  let mockServer: MockServer;
  let router: Router;

  beforeEach(() => {
    // clear any existing session
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [  ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: GoogleOauthService, useValue: mockGoogleService()},
        {provide: XHRBackend, useClass: MockBackend},
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    googleService = TestBed.get(GoogleOauthService);
    page = new Page(fixture);
    loginLogoutPage = new LoginLogoutPage(fixture, googleService);
    const backend: MockBackend = TestBed.get(XHRBackend);
    mockServer = new MockServer(backend);
    router = TestBed.get(Router);
  });

  it('should login, see dashboard and logout', fakeAsync(() => {
    fixture.detectChanges();
    // user sees the login page
    expect(loginLogoutPage.isLoginButtonPresent()).toBeTruthy('user should be logged out');
    // this should be called on app startup
    expect(googleService.onSignedIn).toHaveBeenCalled();
    loginLogoutPage.login();
    // signin process has initiated
    expect(googleService.signIn).toHaveBeenCalled();
    // mock user for the me service
    const user = testusers.getUser('foo@bar.com');
    mockServer.on('/api/me', 'GET', {
      body: JSON.stringify(user),
    });
    // Complete the signin process
    loginLogoutPage.invokeSignin();
    // User is not seeing the login page anymore
    expect(loginLogoutPage.isLoginButtonPresent()).toBeFalsy('user should be logged in');

    // Go to the dashboard (this doesn't happen automagically in unit test land)
    router.navigate(['/']);
    tick();
    fixture.detectChanges();
    // user is seeing the dashboard
    expect(page.isDashboard()).toBeTruthy('user should see the dashboard');

    // Sign out
    googleService.signOut.and.returnValue(Promise.resolve());
    loginLogoutPage.logout();
    // User should be signed out
    expect(googleService.signOut).toHaveBeenCalled();
    expect(loginLogoutPage.isLoginButtonPresent()).toBeTruthy('user should be logged out');
  }));
});
