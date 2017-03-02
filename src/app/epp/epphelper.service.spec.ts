import { EppHelperService } from './epphelper.service';
import { HttpClient } from '../shared/http.client';
import { TextStringService } from '../service/textstring.service';
import { async, fakeAsync, tick } from '@angular/core/testing';
import { TestBed, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, XHRBackend, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';

describe('An EppHelper', () => {
  let mockBackend: MockBackend;
  let service: EppHelperService;
  let lastConnection: any;
  const mockOauthService = {
    getAccessToken: jasmine.createSpy('getAccessToken')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        EppHelperService, HttpClient, TextStringService,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: OAuthService, useValue: mockOauthService }
      ]
    });
  });

  beforeEach(inject([XHRBackend, EppHelperService], (_mockBackend: MockBackend, _service: EppHelperService) => {
    mockBackend = _mockBackend;
    service = _service;
    mockBackend.connections.subscribe((connection: any) => lastConnection = connection);
  }));

  it('should send an xml request to the server', fakeAsync(() => {
    service.send('<epp/>');

    expect(lastConnection).toBeDefined();
    expect(lastConnection.request.getBody()).toBe('<epp/>');
  }));

  it('should parse a successful xml response from the server', fakeAsync(() => {
    const response = service.send('<epp/>');
    response.toPromise().then(result => {
      expect(JSON.stringify(result, null, 2)).toBe(
        `{
  "epp": {
    "@xmlns": "urn:ietf:params:xml:ns:epp-1.0",
    "response": {
      "result": {
        "@code": "1000",
        "msg": {
          "keyValue": "Command completed successfully"
        }
      },
      "trID": {
        "clTRID": {
          "keyValue": "WBP-00000"
        },
        "svTRID": {
          "keyValue": "pw1k4BeCS9ekvfP6LfAVSg==-1"
        }
      }
    }
  }
}`);
    }).catch(reason => {
      fail('Got error response: ' + JSON.stringify(reason));
    });

    expect(lastConnection).toBeDefined();
    expect(lastConnection.request.getBody()).toBe('<epp/>');

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
            <response>
              <result code="1000">
                <msg>Command completed successfully</msg>
              </result>
              <trID>
                <clTRID>WBP-00000</clTRID>
                <svTRID>pw1k4BeCS9ekvfP6LfAVSg==-1</svTRID>
              </trID>
            </response>
          </epp>`
    })));
    tick();
  }));

  it('should parse a failure xml response from the server', fakeAsync(() => {
    const response = service.send('<epp/>');
    response.forEach(item => {
      fail('Expected error but got normal response: ' + JSON.stringify(item));
    }).catch(err => {
      expect(err.code).toBe('999');
      expect(err.message).toBe('Something went very wrong');
    });

    expect(lastConnection).toBeDefined();
    expect(lastConnection.request.getBody()).toBe('<epp/>');

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
            <response>
              <result code="999">
                <msg>Something went very wrong</msg>
              </result>
              <trID>
                <clTRID>WBP-00000</clTRID>
                <svTRID>pw1k4BeCS9ekvfP6LfAVSg==-1</svTRID>
              </trID>
            </response>
          </epp>`
    })));
    tick();
  }));
});
