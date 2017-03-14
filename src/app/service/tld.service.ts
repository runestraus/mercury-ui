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
import { Tld } from '../model/tld.model';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TldService {

  constructor(private http: HttpClient) { }

  /**
   * Gets the TLDs.
   *
   * @returns {Promise<Tld>}
   */
  get(): Promise<Tld[]> {
    return this.http.get('/api/tlds').toPromise()
      .then(res => res.json() as Tld[])
      .catch(this.handleError);
  }

  /**
   * Transforms sate transitions into an object since the activation date (key) is dynamic
   *
   * @param tld
   */
  transform(value): any {
    const keys = [];
    for (const key in value.stateTransitions) {
      if (value.stateTransitions.hasOwnProperty(key)) {
        keys.push({key: key, value: value.stateTransitions[key]});
      }
    }
    return keys;
  }

    /**
   * Creates a new TLD.
   *
   * @returns {Promise<Tld>}
   */
  post(tld: Tld): Promise<Tld[]> {
    return this.http.post('/api/tlds', tld).toPromise()
      .then(res => res.json() as Tld[])
      .catch(this.handleError);
  }

      /**
   * Update a TLD.
   *
   * @returns {Promise<Tld>}
   */
  put(name: string, tld: Tld): Promise<Tld[]> {
    return this.http.put('/api/tlds/' + name, tld).toPromise()
      .then(res => res.json() as Tld[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
