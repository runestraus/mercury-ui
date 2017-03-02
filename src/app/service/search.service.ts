/**
 * Copyright 2017 The Domain Registry Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import { SearchResults } from '../model/search-results.model';
import { HttpClient } from '../shared/http.client';

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}

  getSearchResults(query: string): Promise<SearchResults> {
    return this.http.post('/api/search', { query: query }).toPromise()
      .then(res => res.json() as SearchResults)
      .catch(error => this.http.handleError(error));
  }
}
