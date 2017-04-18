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
import { DpmlBlockService } from './dpml-block.service';

describe('DpmlBlockService', () => {
  let mockBackend: MockBackend;
  let service: DpmlBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ DpmlBlockService, HttpClient, { provide: XHRBackend, useClass: MockBackend } ]
    });
  });

  beforeEach(inject([XHRBackend, DpmlBlockService], (_mockBackend, _service) => {
    mockBackend = _mockBackend;
    service = _service;
  }));

  it('should make a request to api/dpml and find dpml label.', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/blocked\/dpml$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getDpmlBlock('dpml').then(dpml => {
        expect(dpml.label).toBe('Blocked');
    });
  });
  it('should make a request to api/dpml and find nothing', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/blocked\/NOTBLOCKED$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.getDpmlBlock('NOTBLOCKED').then(dpml => {
      expect(dpml.label).toBe(null);
    });
  });
});
