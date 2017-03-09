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

import { SearchService } from './search.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '../shared/http.client';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';

describe('SearchService', () => {
  let mockBackend: MockBackend;
  let service: SearchService;

  const mockOauthService = {
    getAccessToken: jasmine.createSpy('getAccessToken')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ SearchService, HttpClient, { provide: XHRBackend, useClass: MockBackend },
        { provide: OAuthService, useValue: mockOauthService} ]
    });
  });

  beforeEach(inject([XHRBackend, SearchService], (_mockBackend, _service) => {
    mockBackend = _mockBackend;
    mockOauthService.getAccessToken.and.returnValue('mock-token');
    service = _service;
  }));

  it('should make a request to api/search route', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/search$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Post);
    });
    service.getSearchResults('dev.dev').then(searchResults =>
      expect(searchResults.data.length).toBe(1)
    );
  });
});
