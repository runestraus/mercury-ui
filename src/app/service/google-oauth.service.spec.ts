import { TestBed, inject } from '@angular/core/testing';
import { GoogleOauthService } from './google-oauth.service';
import { GapiLoader } from './gapi-loader.service';
import { AbstractMockObservableService } from './testing/abstract-mock-observable-service.test';
import { Subject } from 'rxjs/Subject';

describe('GoogleOauthService', () => {
  class MockGapiLoader extends AbstractMockObservableService {
    load() {
      return new Subject();
    }
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleOauthService,
        {provide: GapiLoader, useClass: MockGapiLoader}]
    });
  });

  it('should ...', inject([GoogleOauthService], (service: GoogleOauthService) => {
    expect(service).toBeTruthy();
  }));
});
