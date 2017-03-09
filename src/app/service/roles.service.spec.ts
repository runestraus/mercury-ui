// Copyright 2017 Donuts Inc. All Rights Reserved.
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

import { TestBed, async, inject } from '@angular/core/testing';
import { RolesService } from './roles.service';
import { Role } from '../model/roles.model';
import 'rxjs/add/operator/toPromise';

describe('RolesService', () => {
  let service: RolesService;
  let mockRole: Role;

  const mockRolesService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: RolesService, useValue: mockRolesService}]
    });
  });

  beforeEach(inject([RolesService], (_service) => {
    mockRole = new Role();
    mockRole.name = 'REGISTRY_ADMIN';
    mockRole.permissions = ['EPP',
      'SERVER_SIDE_STATUS',
      'CRU_REGISTRY_ADMIN',
      'CRU_REGISTRY_USER',
      'CRU_REGISTRAR_ADMIN',
      'CRU_REGISTRAR_USER',
      'CRU_TLD',
      'CRU_REGISTRAR',
      'CRU_PRICE_CATEGORIES',
      'SUPER_USER'];
    mockRolesService.get.and.returnValue(Promise.resolve(mockRole));
    service = _service;
  }));

  it('getRoles() should return roles', async(() => {
    service.get().then(roles => {
      expect(roles.name).toEqual('REGISTRY_ADMIN', ' REGISTRY_ADMIN should be the first role');
      expect(roles.permissions).toEqual(['EPP',
      'SERVER_SIDE_STATUS',
      'CRU_REGISTRY_ADMIN',
      'CRU_REGISTRY_USER',
      'CRU_REGISTRAR_ADMIN',
      'CRU_REGISTRAR_USER',
      'CRU_TLD',
      'CRU_REGISTRAR',
      'CRU_PRICE_CATEGORIES',
      'SUPER_USER'], ' REGISTRY_ADMIN permissions should match');
    });
  }));
});
