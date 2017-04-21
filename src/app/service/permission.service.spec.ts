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

import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { PermissionService } from './permission.service';
import { MeService } from './me.service';
import { User } from '../model/user.model';
import 'rxjs/add/operator/toPromise';
import { SessionService } from './session.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let mockUser: User;

  const mockSessionService = {
    getCurrentUser: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionService, { provide: SessionService, useValue: mockSessionService}]
    });
  });

  beforeEach(inject([PermissionService], (_service) => {
    mockUser = new User();
    mockUser.permissions = ['EPP', 'SERVER_SIDE_STATUS'];
    mockSessionService.getCurrentUser.and.returnValue(Promise.resolve({user: mockUser, profile: {}}));
    service = _service;
  }));

  it('should return true if user has permission', fakeAsync(() => {
    service.can('EPP')
      .then((res) => {
        expect(res).toBeTruthy();
      });
    tick();
  }));

  it('should return false if user does not have permission', fakeAsync(() => {
    service.can('CREATE_SOMETHING')
      .then((res) => {
        expect(res).toBeFalsy();
      });
    tick();
  }));

  it('should resolve authorized true when the user can perform the action', fakeAsync(() => {
    const testObject = {theTest: 'Valid'};
    const mockPolicy = { assertion: jasmine.createSpy('assertion') };
    mockPolicy.assertion.and.returnValue(null);
    service.authorize(mockPolicy.assertion, testObject)
      .then(res => {
        expect(res.authorized).toBeTruthy();
      })
      .catch(fail);
    tick();
    expect(mockPolicy.assertion).toHaveBeenCalledWith(testObject, mockUser);
  }));

  it('should throw an error when the user can not perform the action', fakeAsync(() => {
    const testObject = {theTest: 'NotValid'};
    const mockPolicy = { assertion: jasmine.createSpy('assertion') };
    mockPolicy.assertion.and.returnValue('Not valid for this operation');
    service.authorize(mockPolicy.assertion, testObject)
      .then(res => {
        expect(res.message).toBe('Not valid for this operation');
        expect(res.authorized).toBeFalsy();
      })
      .catch(fail);
    tick();
    expect(mockPolicy.assertion).toHaveBeenCalledWith(testObject, mockUser);
  }));
});
