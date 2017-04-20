import { TestBed, inject } from '@angular/core/testing';
import { RegistrarService } from './registrar.service';
import { HttpClient } from '../shared/http.client';
import 'rxjs/add/operator/toPromise';
import { Registrar } from '../model/registrar.model';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('RegistrarService', () => {
  let service: RegistrarService;
  let mockBackend: MockBackend;
  let mockRegistrar: Registrar;

  const mockRegistrarService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: RegistrarService, useValue: mockRegistrarService},
      { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  beforeEach(inject([RegistrarService, XHRBackend], (_service, _mockBackend) => {
    mockBackend = _mockBackend;
    mockRegistrar = new Registrar;
    mockRegistrar.registrarName = 'Donuts, Inc';
    mockRegistrarService.get.and.returnValue(Promise.resolve(mockRegistrar));
    service = _service;
  }));

  it('should make a request to api/registrars/tldsrus route', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/registrars\/tldsrus$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.get().then(registrar =>
      expect(registrar).toBe(mockRegistrar)
    );
  });
});
