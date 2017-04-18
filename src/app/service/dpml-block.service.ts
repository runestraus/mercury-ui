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

import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/http.client';
import { Dpml } from '../model/dpml.model';

@Injectable()
export class DpmlBlockService {

  constructor(private http: HttpClient) { }
  /**
   * Get Dpml Block from label
   *
   * @returns {Promise<R>|Observable<R>|promise.Promise<R>|Maybe<T>|Promise<Promise<any>>}
   */
  getDpmlBlock(label: string): Promise<Dpml> {
    return this.http.get('/api/blocked/' + label).toPromise()
      .then(res => res.json() as Dpml)
      .catch(error => this.http.handleError(error));
  }
}
