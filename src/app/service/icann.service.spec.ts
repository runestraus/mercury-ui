import { TestBed, inject } from '@angular/core/testing';
import { IcannService } from './icann.service';
import { HttpClient } from '../shared/http.client';
import { HttpModule, XHRBackend, RequestMethod } from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { IcannDns } from '../model/icannDns.counter.model';
import { Tld } from '../model/tld.model';
import { IcannRegistrar } from '../model/icannRegistrar.counter.model';
import { IcannTld } from '../model/icannTld.counter.model';

const mockOauthService = {
  getAccessToken: jasmine.createSpy('getAccessToken')
};

describe('IcannService', () => {
  let mockBackend: MockBackend;
  let service: IcannService;
  let tlds: Promise<Tld[]>;
  const icannDns = IcannDns;
  const icannRegistrar = IcannRegistrar;
  const icannTld = IcannTld;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:      [ HttpModule ],
      providers: [IcannService, HttpClient,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: OAuthService, useValue: mockOauthService}]
    });

    this.icannDns = new IcannDns();
    this.icannDns.tld = 'dev';
    this.icannDns.month = 12;
    this.icannDns.year = 2017;
    this.icannDns.dnsTcpQueriesRespondedCount = 1;
    this.icannDns.dnsTcpQueriesReceivedCount = 1;
    this.icannDns.dnsUdpQueriesReceivedCount = 1;
    this.icannDns.dnsUdpQueriesRespondedCount = 1;

    this.icannRegistrar = new IcannRegistrar();
    this.icannRegistrar.tld = 'dev';
    this.icannRegistrar.month = 12;
    this.icannRegistrar.year = 2017;
    this.icannRegistrar.clientId = 'brodaddy';
    this.icannRegistrar.preRampUpRegistrarsCount = 1;
    this.icannRegistrar.rampUpRegistrarsCount = 1;
    this.icannRegistrar.zfaPasswordsCount = 1;

    this.icannTld = new IcannTld();
    this.icannTld.tld = 'dev';
    this.icannTld.month = 12;
    this.icannTld.year = 2017;
    this.icannTld.agpExemptedDomainsCount = 1;
    this.icannTld.agpExemptionRequestsCount = 1;
    this.icannTld.agpExemptionsGrantedCount = 1;
    this.icannTld.transferDisputedLostCount = 1;
    this.icannTld.transferDisputedWonCount = 1;
    this.icannTld.transferDisputedNondecisionCount = 1;
  });

  beforeEach(inject([XHRBackend, IcannService], (_mockBackend, _service) => {
    mockBackend = _mockBackend;
    mockOauthService.getAccessToken.and.returnValue('mock-token');
    service = _service;
  }));

  it('should ...', inject([IcannService], (icannService: IcannService) => {
    expect(icannService).toBeTruthy();
  }));

  it('Should get all tlds in system', () => {
    tlds = service.getAllTlds();
    expect(tlds).toBeTruthy();
  });

  it('should make a request to api/tlds', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/tlds/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getAllTlds();
  });

  it('should make a request to /api/icann/registrar/brodaddy/dev/2017/12', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/icann\/registrar\/brodaddy\/dev\/2017\/12/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getIcannRegistrar(this.icannRegistrar);
  });

  it('should make a request to /api/icann/dns/dev/2017/12', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/icann\/dns\/dev\/2017\/12/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getIcannDns(this.icannDns);
  });

  it('should make a request to api/icann/tld/dev/2017/12', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/icann\/tld\/dev\/2017\/12/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getIcannTld(this.icannTld);
  });

  it('should make a request to api/icann/tld', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/icann\/tld/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Post);
    });
    service.submitIcannTld(this.icannTld);
  });

  it('should make a request to api/icann/dns', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/icann\/dns/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Post);
    });
    service.submitIcannDns(this.icannDns);
  });

  it('should make a request to api/icann/registrar', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/icann\/registrar/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Post);
    });
    service.submitIcannRegistrar(this.icannRegistrar);
  });
});
