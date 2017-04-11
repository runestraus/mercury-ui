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

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { XHRBackend, RequestMethod, HttpModule } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ToolsService } from './tools.service';
import { CSV } from '../model/csv.model';

describe('ToolsService', () => {
    let service: ToolsService;
    let mockCSV: CSV;
    let mockUploadResult: {};
    let mocBackend: MockBackend;

    const mockToolsService = {
        validateCSV: jasmine.createSpy('validateCSV'),
        uploadCSV: jasmine.createSpy('uploadCSV')
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: ToolsService, useValue: mockToolsService }, { provide: XHRBackend, useClass: MockBackend }]
      });
    });

    beforeEach(inject([ToolsService, XHRBackend], (_service, _mockBackend) => {
        mocBackend = _mockBackend;
        mockCSV = new CSV;
        mockCSV.create = 1;
        mockCSV.delete = 0;
        mockCSV.update = 0;
        mockCSV.total = 1;

        mockUploadResult = {
          total: 1,
          create: 0,
          update: 1,
          delete: 0,
          result: {
          create: [],
          update: [{name: 'italys.pizza', category: 'BBB+',
            price: {value: 66, currency: 'USD'},
            futureCategory: null, changeDate: '2018-12-31'}],
            delete: []}
        };
        service = _service;
        mockToolsService.validateCSV.and.returnValue(Promise.resolve(mockCSV));
        mockToolsService.uploadCSV.and.returnValue(Promise.resolve(mockUploadResult));
    }));

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should make a request to /api/premiumnames/csv and validate CSV', () => {
        mocBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(RequestMethod.Post);
            expect(mockToolsService.validateCSV.and.returnValue(Promise.resolve(mockCSV)));
        });
        service.validateCSV('/api/premiumnames/csv', event).then(res =>
          expect(res).toBe(mockCSV)
        ).catch(err => {
          fail('Err: ' + err);
        });
    });

    it('should make a request to /api/premiumnames/csv and upload CSV', () => {
        mocBackend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.method).toBe(RequestMethod.Post);
            expect(mockToolsService.uploadCSV.and.returnValue(Promise.resolve(mockUploadResult)));
        });
        service.validateCSV('/api/premiumnames/csv/someTokenString', event).then(res =>
          expect(res).toBe(mockCSV)
        ).catch(err => {
          fail('Err: ' + err);
        });
    });
});
