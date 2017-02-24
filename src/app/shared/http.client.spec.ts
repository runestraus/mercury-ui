/* tslint:disable:no-unused-variable */
import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClient } from './http.client';
import { HttpModule, XHRBackend, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Injector } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

describe('HttpClient', () => {
  let mockBackend: MockBackend;
  let client: HttpClient;
  let injector: Injector;
  const mockOauthService = {
    getAccessToken: jasmine.createSpy('getAccessToken')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        HttpClient,
        { provide: OAuthService, useValue: mockOauthService }
      ]
    });
    injector = getTestBed();
  });

  beforeEach(inject([XHRBackend, HttpClient], (_mockBackend, _client) => {
    mockBackend = _mockBackend;
    client = _client;
    mockOauthService.getAccessToken.and.returnValue('mock-token');
  }));

  it('get() should make a get request to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    client.get('/api/domains');
  });

  it('post() should send the data to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.getBody()).toBe('some string');
    });
    client.post('/api/domains', 'some string');
  });

  it('put() should send data with a put to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(connection.request.getBody()).toBe('some string');
    });
    client.put('/api/domains', 'some string');
  });

  it('delete() should send data with a put to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Delete);
    });
    client.delete('/api/domains');
  });
});
