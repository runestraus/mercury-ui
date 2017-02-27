/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PermissionService } from './Permission.service';

describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionService]
    });
  });

  it('should ...', inject([PermissionService], (service: PermissionService) => {
    expect(service).toBeTruthy();
  }));
});
