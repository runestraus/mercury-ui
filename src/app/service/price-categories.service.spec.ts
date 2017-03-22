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

import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '../shared/http.client';
import { PriceCategoriesService } from './price-categories.service';
import { PriceCategory } from '../model/price-category.model';
import 'rxjs/add/operator/toPromise';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('PriceCategoriesService', () => {
  let service: PriceCategoriesService;
  let mockBackend: MockBackend;
  let mockPriceCategory: PriceCategory;

  const mockPriceCategoriesService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PriceCategoriesService, useValue: mockPriceCategoriesService}, { provide: XHRBackend, useClass: MockBackend }]
    });
  });

  beforeEach(inject([PriceCategoriesService, XHRBackend], (_service, _mockBackend) => {
    mockBackend = _mockBackend;
    mockPriceCategory = new PriceCategory;
    mockPriceCategory.name = 'AA';
    mockPriceCategory.price = {value: 55.00, currency: 'USD'};
    mockPriceCategoriesService.get.and.returnValue(Promise.resolve(mockPriceCategory));
    service = _service;
  }));

  it('should make a request to api/pricecategories route', () => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/api\/pricecategories$/, 'url invalid');
      expect(connection.request.method).toBe(RequestMethod.Get);
    });
    service.get().then(priceCategories =>
      expect(priceCategories).toBe(mockPriceCategory)
    );
  });
});
