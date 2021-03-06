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
import { HttpClient } from '../shared/http.client';
import { RegistrarUser } from '../model/users.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  /**
   * Gets the users.
   *
   * @returns {Promise<RegistrarUser>}
   */
  get(): Promise<RegistrarUser[]> {
    return this.http.get('/api/user').toPromise()
      .then(res => res.json() as RegistrarUser[])
      .catch(this.handleError);
  }

    /**
   * Creates a new user.
   *
   * @returns {Promise<RegistrarUser>}
   */
  post(user: RegistrarUser): Promise<RegistrarUser[]> {
    return this.http.post('/api/user', user).toPromise()
      .then(res => res.json() as RegistrarUser[])
      .catch(this.handleError);
  }

      /**
   * Update a user.
   *
   * @returns {Promise<RegistrarUser>}
   */
  put(email: string, user: RegistrarUser): Promise<RegistrarUser[]> {
    return this.http.put('/api/user/' + email, user).toPromise()
      .then(res => res.json() as RegistrarUser[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
