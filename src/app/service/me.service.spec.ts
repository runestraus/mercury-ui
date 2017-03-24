/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { MeService } from './me.service';
import { HttpClient } from '../shared/http.client';
import { HttpModule, XHRBackend, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { SessionService } from './session.service';

describe('MeService', () => {
  let mockBackend: MockBackend;
  let service: MeService;
  const mockSessionService = {
    getAccessToken: jasmine.createSpy('getAccessToken')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [MeService, HttpClient, { provide: XHRBackend, useClass: MockBackend },
        { provide: SessionService, useValue: mockSessionService}]
    });
  });

  beforeEach(inject([XHRBackend, MeService], (_mockBackend, _service) => {
    mockBackend = _mockBackend;
    mockSessionService.getAccessToken.and.returnValue('mock-token');
    service = _service;
  }));

  it('should make a request to api/me route', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/me$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.get();
  });
});
