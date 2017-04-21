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
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { SessionService } from './session.service';
import { User } from '../model/user.model';

@Injectable()
export class PermissionService {
  constructor(private sessionService: SessionService) {
  }

  /**
   * Validates if the current signed in user has a given permission
   *
   * @param permission Permission to check for.
   * @returns {Promise<boolean>} completes with true if user has permission else false.
   */
  can(permission: string): Promise<boolean> {
    return this.sessionService.getCurrentUser()
      .then(userData => {
        return userData.user.permissions.some(perm => perm === permission);
      });
  }

  /**
   * Gets authorization on whether a user can perform an specified function.
   *
   * If the user can not perform the function an AuthMessage will be returned with authorized = false and  a message
   * why the action cannot be performed. If the user can perform the function Promise will be resolved with
   * authorized = true.
   *
   * @param action a PolicyFn of what action the user would like to perform.
   * @param object The object to check the action against
   * @returns {Promise<AuthMessage>} returns an {@link AuthMessage} that returns if the user is authorized and a message
   * if they are not authorized.
   */
  authorize(action: PolicyFn, object: any): Promise<AuthMessage> {
    return this.sessionService.getCurrentUser()
      .then(userData => {
        const error = action(object, userData.user);
        if (error === null) {
          return { authorized: true };
        }
        return { authorized: false, message: error };
      });
  }
}
export type PolicyFn = (c: any, user: User) => string | null;

export interface AuthMessage {
  authorized: boolean;
  message?: string;
}
