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
import { Registrar } from '../model/registrar.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RegistrarService {

  constructor(private http: HttpClient) { }

    /**
   * Gets the Registrar.
   *
   * @param clisentId
   * @returns {Promise<Registrar>}
   */
  get(clientId?: string): Promise<Registrar> {
    return this.http.get('/api/registrars/' + clientId).toPromise()
      .then(res => res.json() as Registrar)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
