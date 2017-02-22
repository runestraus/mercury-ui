/* tslint:disable:no-unused-variable */

import {TestBed, async, inject } from '@angular/core/testing';
import {RegistryAPIService} from './RegistryAPI.service';

describe('RegistryAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistryAPIService]
    });
  });

  it('should ...', inject([RegistryAPIService], (service: RegistryAPIService) => {
    expect(service).toBeTruthy();
  }));
});
