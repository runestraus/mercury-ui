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
import { UsersService } from './users.service';
import { HttpClient } from '../shared/http.client';
import { RegistrarUser } from '../model/users.model';
import 'rxjs/add/operator/toPromise';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('UsersService', () => {
  let service: UsersService;
  let mockBackend: MockBackend;
  let mockUser: RegistrarUser;

  const mockUsersService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UsersService, useValue: mockUsersService}, { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  beforeEach(inject([UsersService, XHRBackend], (_service, _mockBackend) => {
    mockBackend = _mockBackend;
    mockUser = new RegistrarUser;
    mockUser.email = 'someuser@gmail.com';
    mockUser.clientId = 'brodaddy';
    mockUsersService.get.and.returnValue(Promise.resolve(mockUser));
    service = _service;
  }));

  it('should make a request to api/users route', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/users$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.get().then(users =>
      expect(users).toBe(mockUser)
    );
  });
});
