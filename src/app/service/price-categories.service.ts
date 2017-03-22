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
import { PriceCategory } from '../model/price-category.model';

@Injectable()
export class PriceCategoriesService {

  constructor(private http: HttpClient) { }

  /**
   * Gets the price categories.
   *
   * @returns {Promise<PriceCategory>}
   */
  get(): Promise<PriceCategory[]> {
    return this.http.get('/api/pricingcategories').toPromise()
      .then(res => res.json() as PriceCategory[])
      .catch(this.handleError);
  }

    /**
   * Creates a price category.
   *
   * @returns {Promise<PriceCategory>}
   */
  post(pricecategory: PriceCategory): Promise<PriceCategory[]> {
    return this.http.post('/api/pricingcategories', pricecategory).toPromise()
      .then(res => res.json() as PriceCategory[])
      .catch(this.handleError);
  }

  /**
  * Update a price category.
  *
  * @returns {Promise<PriceCategory>}
  */
  put(name: string, pricecategory: PriceCategory): Promise<PriceCategory[]> {
    return this.http.put('/api/pricingcategories/' + name, pricecategory).toPromise()
      .then(res => res.json() as PriceCategory[])
      .catch(this.handleError);
  }

  /**
  * Update a price category.
  *
  * @returns {Promise<PriceCategory>}
  */
  delete(name: string): Promise<PriceCategory[]> {
    return this.http.delete('/api/pricingcategories/' + name).toPromise()
      .then(res => res.json() as PriceCategory[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
