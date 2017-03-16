import { TestBed, inject } from '@angular/core/testing';
import { GapiLoader } from './gapi-loader.service';


describe('GapiLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GapiLoader]
    });
  });

  it('should ...', inject([GapiLoader], (service: GapiLoader) => {
    expect(service).toBeTruthy();
  }));
});
