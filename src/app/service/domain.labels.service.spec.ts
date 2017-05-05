// Copyright 2016 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '../shared/http.client';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DomainLabelsService } from './domain.lables.service';

describe('DpmlBlockService', () => {
  let mockBackend: MockBackend;
  let service: DomainLabelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ DomainLabelsService, HttpClient, { provide: XHRBackend, useClass: MockBackend } ]
    });
  });

  beforeEach(inject([XHRBackend, DomainLabelsService], (_mockBackend, _service) => {
    mockBackend = _mockBackend;
    service = _service;
  }));

  it('should make a request to api/tags and find label.', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/tags\/dev.dev$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getDomainLabels('dev.dev').then(domainName => {
        expect(domainName.price).toBe('10.33');
    });
  });

  it('should make a request to api/tags and find nothing', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/tags\/NODOMAIN/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getDomainLabels('NODOMAIN').then(domainName => {
      expect(domainName.labels).toBe(null);
    });
  });
});
