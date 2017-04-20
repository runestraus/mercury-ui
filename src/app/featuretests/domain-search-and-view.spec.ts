import { XHRBackend, Request, ResponseOptionsArgs} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {
  fakeAsync, tick, TestBed, ComponentFixture
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from '../app.module';
import { AppComponent } from '../app.component';
import { mockGoogleService } from './mocks';
import { MockServer } from './server.mock';

import { GoogleOauthService } from '../service/google-oauth.service';
import { LoginLogoutPage } from './pages/login-logout.po';
import { SearchPage } from './pages/search.po';
import { DomainPopupPage } from './pages/domain-pop-po';
import * as testusers from './testdata/testusers';
import * as searchresults from './testdata/searchresults';
import * as testcontacts from './testdata/testcontacts';
import * as testdomains from './testdata/testdomains';
import {DpmlBlockService} from '../service/dpml-block.service';

describe('domain search', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginLogoutPage: LoginLogoutPage;
  let searchPage: SearchPage;
  let domainPopupPage: DomainPopupPage;

  let googleService: any;
  let mockServer: MockServer;
  let router: Router;

  const mockDpmlService = {
    getDpmlBlock: jasmine.createSpy('getDpmlBlock'),
  };

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
        { provide: DpmlBlockService, useValue: mockDpmlService}
      ],
    })
    .compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    googleService = TestBed.get(GoogleOauthService);
    searchPage = new SearchPage(fixture);
    loginLogoutPage = new LoginLogoutPage(fixture, googleService);
    domainPopupPage = new DomainPopupPage(fixture);
    const backend: MockBackend = TestBed.get(XHRBackend);
    mockServer = new MockServer(backend);
    router = TestBed.get(Router);

    fixture.detectChanges();
    loginLogoutPage.login();
    // mock user for the me service
    const user = testusers.getUser('foo@bar.com');
    mockServer.on('/api/me', 'GET', {
      body: JSON.stringify(user),
    });
    // Complete the signin process
    loginLogoutPage.invokeSignin();
  }));

  it('should search for registered domain and see results', fakeAsync(() => {
    // Go to the dashboard and search for our domain
    router.navigate(['/']);
    tick();
    fixture.detectChanges();
    // program response for dev.dev
    mockServer.on('/api/search', 'POST', {
      body: JSON.stringify(searchresults.getSearchResult('dev.dev'))
    });
    searchPage.searchFor('dev.dev');
    // router should be at correct route for search
    expect(router.url).toBe('/search/dev.dev');
    // verify the request was made correctly
    const searchRequests = mockServer.getRequests('/api/search', '*');
    expect(searchRequests.length).toBe(1);
    const searchRequest = searchRequests[0];
    expect(JSON.parse(searchRequest.getBody())).toEqual({query: 'dev.dev'});
    // verify that the results are rendered correctly on the page
    const searchResultData = searchPage.getSearchResultData();
    expect(searchResultData.length).toBe(1);
    expect(searchResultData[0]).toEqual({
      'Domain': 'dev.dev',
      'TLD': 'dev',
      'Status': 'OK',
      'System Tags': 'REG',
      'Price': '$20.00',
      'Category': '',
      'IANA ID': '',
      'Registrar': 'BroDaddy'
    });
  }));

  it('should search for available domain and see results', fakeAsync(() => {
    // Go to the dashboard and search for our domain
    router.navigate(['/']);
    tick();
    fixture.detectChanges();
    // program response for dev.dev
    mockServer.on('/api/search', 'POST', {
      body: JSON.stringify(searchresults.getSearchResult('unregistered.dev'))
    });
    searchPage.searchFor('unregistered.dev');
    // router should be at correct route for search
    expect(router.url).toBe('/search/unregistered.dev');
    // verify the request was made correctly
    const searchRequests = mockServer.getRequests('/api/search', '*');
    expect(searchRequests.length).toBe(1);
    const searchRequest = searchRequests[0];
    expect(JSON.parse(searchRequest.getBody())).toEqual({query: 'unregistered.dev'});
    // verify that the results are rendered correctly on the page
    const searchResultData = searchPage.getSearchResultData();
    expect(searchResultData.length).toBe(1);
    expect(searchResultData[0]).toEqual({
      'Domain': 'unregistered.dev',
      'TLD': 'dev',
      'Status': 'AVAILABLE',
      'System Tags': '',
      'Price': '$20.00',
      'Category': '',
      'IANA ID': '',
      'Registrar': ''
    });
  }));

  it('should show search results from url and popup domain when clicked', fakeAsync(() => {
    // program response for dev.dev
    mockServer.on('/api/search', 'POST', {
      body: JSON.stringify(searchresults.getSearchResult('dev.dev'))
    });

    // navigate to search for dev.dev
    router.navigate(['/search/dev.dev']);
    tick();
    fixture.detectChanges();

    // verify the request was made correctly
    const searchRequests = mockServer.getRequests('/api/search', '*');
    expect(searchRequests.length).toBe(1);
    const searchRequest = searchRequests[0];
    expect(JSON.parse(searchRequest.getBody())).toEqual({query: 'dev.dev'});
    // verify that the results are rendered correctly on the page
    const searchResultData = searchPage.getSearchResultData();
    expect(searchResultData.length).toBe(1);
    expect(searchResultData[0]).toEqual({
      'Domain': 'dev.dev',
      'TLD': 'dev',
      'Status': 'OK',
      'System Tags': 'REG',
      'Price': '$20.00',
      'Category': '',
      'IANA ID': '',
      'Registrar': 'BroDaddy'
    });

    mockDpmlService.getDpmlBlock.and.returnValue(Promise.resolve({label: null, }));

    // program response for domain and contact info commands
    // since this is epp, a single handler needs to deal with multiple request types
    const eppDomain = testdomains.getDomainEpp('dev.dev');
    const eppContact = testcontacts.getContactEpp('bobby');
    mockServer.on('/api/epp', 'POST', (request: Request): ResponseOptionsArgs => {
      const body = request.getBody() as string;
      if (body.indexOf('contact:info') > -1) {
        return {
          body: eppContact,
        };
      } else {
        return {
          body: eppDomain,
        };
      }
    });
    mockServer.on('/api/registrars/brodaddy', 'GET', {
      body: JSON.stringify(searchresults.getRegistrar())
    });
    // Click on domain name to view details in popup
    searchPage.clickSearchResult(0);
    // wait for the second contact:info command to complete and display contact info
    tick();
    fixture.detectChanges();
    const getRegistrarRequest = mockServer.getRequests('/api/registrars/brodaddy');
    expect(domainPopupPage.getRegistrar()).toBe('Donuts, Inc.');
    expect(getRegistrarRequest.length).toBe(1);
    expect(domainPopupPage.getHeaderDomainName()).toBe('dev.dev');
    expect(domainPopupPage.getDisplayedContactName('bobby')).toBe('Bob Smith - Tacoma, US');
    expect(domainPopupPage.getDisplayedContactType('bobby')).toBe('registrant');
  }));
});

