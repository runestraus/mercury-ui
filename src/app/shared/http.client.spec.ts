/* tslint:disable:no-unused-variable */
import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClient } from './http.client';
import { HttpModule, XHRBackend, RequestMethod, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Injector } from '@angular/core';

describe('HttpClient', () => {
  let mockBackend: MockBackend;
  let client: HttpClient;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        HttpClient
      ]
    });
    injector = getTestBed();
  });

  beforeEach(inject([XHRBackend, HttpClient], (_mockBackend, _client) => {
    mockBackend = _mockBackend;
    client = _client;
  }));

  it('get() should make a get request to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    client.get('/api/domains');
  });

  it('get() should send custom headers to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.headers.get('foo')).toBe('bar');
    });
    client.get('/api/domains', new Headers({'foo': 'bar'}));
  });

  it('post() should send the data to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.getBody()).toBe('some string');
    });
    client.post('/api/domains', 'some string');
  });

  it('post() should send custom headers to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.headers.get('foo')).toBe('bar');
    });
    client.post('/api/domains', '', new Headers({'foo': 'bar'}));
  });

  it('put() should send data with a put to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Put);
      expect(connection.request.getBody()).toBe('some string');
    });
    client.put('/api/domains', 'some string');
  });

  it('put() should send custom headers to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.headers.get('foo')).toBe('bar');
    });
    client.put('/api/domains', '', new Headers({'foo': 'bar'}));
  });

  it('delete() should send data with a put to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/domains$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Delete);
    });
    client.delete('/api/domains');
  });

  it('delete() should send custom headers to provided url', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.headers.get('foo')).toBe('bar');
    });
    client.delete('/api/domains', new Headers({'foo': 'bar'}));
  });
});
