// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { TestBed, async, inject } from '@angular/core/testing';
import { TldService } from './tld.service';
import { HttpClient } from '../shared/http.client';
import { Tld } from '../model/tld.model';
import 'rxjs/add/operator/toPromise';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('TldService', () => {
  let service: TldService;
  let mockBackend: MockBackend;
  let mockTld: Tld;

  const mockTldService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TldService, useValue: mockTldService}, { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  beforeEach(inject([TldService, XHRBackend], (_service, _mockBackend) => {
    mockBackend = _mockBackend;
    mockTld = new Tld;
    mockTld.name = 'name';
    mockTld.state = 'PREDELEGATION';
    mockTldService.get.and.returnValue(Promise.resolve(mockTld));
    service = _service;
  }));

  it('should make a request to api/tlds route', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/tlds$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.get().then(tlds =>
      expect(tlds).toBe(mockTld)
    );
  });
});
