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
import { PermissionService } from './Permission.service';
import { MeService } from './me.service';
import { User } from '../model/user.model';
import 'rxjs/add/operator/toPromise';

describe('PermissionService', () => {
  let service: PermissionService;
  let mockUser: User;

  const mockMeService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionService, { provide: MeService, useValue: mockMeService}]
    });
  });

  beforeEach(inject([PermissionService], (_service) => {
    mockUser = new User();
    mockUser.permissions = ['EPP', 'SERVER_SIDE_STATUS'];
    mockMeService.get.and.returnValue(Promise.resolve(mockUser));
    service = _service;
  }));

  it('getPermissions() should return some permissions', async(() => {
    service.getPermissions().then(perms => {
      expect(perms.length).toEqual(2, 'should contain given amount of permissions');
      expect(perms[0]).toEqual('EPP', ' EPP should be the first permission');
      expect(perms[1]).toEqual('SERVER_SIDE_STATUS', ' SERVER_SIDE_STATUS should be the second permission');
    });
  }));

});
