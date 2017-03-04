import { HostEppService } from './hostepp.service';
import { HostDetail } from './host.model';
import { HttpClient } from '../shared/http.client';
import { TextStringService } from '../service/textstring.service';
import { EppHelperService } from '../epp/epphelper.service';
import { HostUpdateInfo, AddrInfo } from '../epp/hostepp.template';

import { async, fakeAsync, tick } from '@angular/core/testing';
import { TestBed, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  HttpModule, XHRBackend, RequestMethod, Response, ResponseOptions
} from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';

describe('A ContactEppService', () => {
  let mockBackend: MockBackend;
  let service: HostEppService;
  let lastConnection: MockConnection;
  const mockOauthService = {
    getAccessToken: jasmine.createSpy('getAccessToken')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        HostEppService, EppHelperService, HttpClient, TextStringService,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: OAuthService, useValue: mockOauthService }
      ]
    });
  });

  beforeEach(
    inject(
      [XHRBackend, HostEppService],
      (_mockBackend: MockBackend, _service: HostEppService) => {
    mockBackend = _mockBackend;
    service = _service;
    mockBackend.connections.subscribe(
      (connection: any) => lastConnection = connection);
  }));

  afterEach(() => {
    lastConnection = null;
  });

  it('should perform a host info operation', fakeAsync(() => {
    service.infoHost('ns4.holy.cow').then(host => {
      expect(host.creationClientId).toBe('tldsrus');
      expect(host.creationTime).toBe('2016-06-20T21:10:13Z');
      expect(host.currentSponsorClientId).toBe('tldsrus');
      expect(host.fullyQualifiedHostName).toBe('ns4.holy.cow');
      expect(host.inetAddresses).toEqual(['127.0.0.126', '123.4.5.123']);
      expect(host.lastEppUpdateClientId).toBe('tldsrus');
      expect(host.lastEppUpdateTime).toBe('2016-06-21T15:31:53Z');
      expect(host.lastTransferTime).toBe('');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <host:info xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.holy.cow</host:name>
      </host:info>
    </info>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
              <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
                  xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <resData>
                      <host:infData>
                        <host:name>ns4.holy.cow</host:name>
                        <host:roid>2830161-ROID</host:roid>
                        <host:status s="ok"/>
                        <host:addr ip="v4">127.0.0.126</host:addr>
                        <host:addr ip="v4">123.4.5.123</host:addr>
                        <host:clID>tldsrus</host:clID>
                        <host:crID>tldsrus</host:crID>
                        <host:crDate>2016-06-20T21:10:13Z</host:crDate>
                        <host:upID>tldsrus</host:upID>
                        <host:upDate>2016-06-21T15:31:53Z</host:upDate>
                      </host:infData>
                  </resData>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>G2Q86dukRgyISAMGY/Hygw==-12</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should handle host info error', fakeAsync(() => {
    service.infoHost('ns4.holy.cow').then(host => {
      fail('Expected error but got result: ' + JSON.stringify(host));
    }).catch(err => {
      expect(err.code).toBe('2303');
      expect(err.message).toBe('The host with given ID (ns4.unholy.cow) doesn\'t exist.');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <host:info xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.holy.cow</host:name>
      </host:info>
    </info>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
              <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
                  xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2303">
                      <msg>The host with given ID (ns4.unholy.cow) doesn't exist.</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>G2Q86dukRgyISAMGY/Hygw==-12</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should perform a host check operation (available)', fakeAsync(() => {
    service.checkHost('ns4.unholy.cow').then(checkResult => {
      expect(checkResult.avail).toBe(true);
      expect(checkResult.fullyQualifiedHostName).toBe('ns4.unholy.cow');
      expect(checkResult.reason).toBe('');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <host:check xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.unholy.cow</host:name>
      </host:check>
    </check>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
              <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
                  xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <resData>
                    <host:chkData>
                        <host:cd>
                            <host:name avail="true">ns4.unholy.cow</host:name>
                        </host:cd>
                    </host:chkData>
                </resData>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>G2Q86dukRgyISAMGY/Hygw==-12</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should perform a host check operation (unavailable)', fakeAsync(() => {
    service.checkHost('ns4.holy.cow').then(checkResult => {
      expect(checkResult.avail).toBe(false);
      expect(checkResult.fullyQualifiedHostName).toBe('ns4.holy.cow');
      expect(checkResult.reason).toBe('In use');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <host:check xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.holy.cow</host:name>
      </host:check>
    </check>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
              <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
                  xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <resData>
                    <host:chkData>
                        <host:cd>
                            <host:name avail="false">ns4.holy.cow</host:name>
                            <host:reason>In use</host:reason>
                        </host:cd>
                    </host:chkData>
                </resData>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>G2Q86dukRgyISAMGY/Hygw==-12</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should perform a host create operation', fakeAsync(() => {
    service.createHost('ns4.holy.cow', ['127.0.0.1']).then(result => {
      expect(result.code).toBe('1000');
      expect(result.message).toBe('Command completed successfully');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.holy.cow</host:name>
            <host:addr ip="4">127.0.0.1</host:addr>
      </host:create>
    </create>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <resData>
                      <host:creData>
                        <host:name>ns4.holy.cow</host:name>
                        <host:crDate>2016-09-20T20:31:22Z</host:crDate>
                      </host:creData>
                  </resData>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCMvFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should handle host create error', fakeAsync(() => {
    service.createHost('ns99.holy.cow', ['127.0.0.1']).then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result, null, 2));
    }).catch(err => {
      expect(err.code).toBe('2303');
      expect(err.message).toBe('Object with given ID (ns99.holy.cow) already exists');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns99.holy.cow</host:name>
            <host:addr ip="4">127.0.0.1</host:addr>
      </host:create>
    </create>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2303">
                      <msg>Object with given ID (ns99.holy.cow) already exists</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCMvFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should generate a host update operation', fakeAsync(() => {
    const hostUpdateInfo: HostUpdateInfo = {
      addAddrs: [{value: '127.0.0.1'}],
      remAddrs: [{value: '10.0.0.1'}],
      addStatuses: ['clientUpdateProhibited'],
      remStatuses: ['serverUpdateProhibited'],
    };
    service.updateHost('ns4.holy.cow', hostUpdateInfo).then(result => {
      expect(result.code).toBe('1000');
      expect(result.message).toBe('Command completed successfully');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.holy.cow</host:name>
        <host:add>
          <host:addr ip="4">127.0.0.1</host:addr>
          <host:status s="clientUpdateProhibited"/>
        </host:add>
        <host:rem>
          <host:addr ip="4">10.0.0.1</host:addr>
          <host:status s="serverUpdateProhibited"/>
        </host:rem>
      </host:update>
    </update>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCMvFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should handle host update error', fakeAsync(() => {
    const hostUpdateInfo: HostUpdateInfo = {
      addAddrs: [{value: '127.0.0.1'}],
      remAddrs: [{value: '10.0.0.1'}],
      addStatuses: ['clientUpdateProhibited'],
      remStatuses: ['serverUpdateProhibited'],
    };
    service.updateHost('ns99.holy.cow', hostUpdateInfo).then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result, null, 2));
    }).catch(err => {
      expect(err.code).toBe('2303');
      expect(err.message).toBe('Object with given ID (ns99.holy.cow) could not be updated');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns99.holy.cow</host:name>
        <host:add>
          <host:addr ip="4">127.0.0.1</host:addr>
          <host:status s="clientUpdateProhibited"/>
        </host:add>
        <host:rem>
          <host:addr ip="4">10.0.0.1</host:addr>
          <host:status s="serverUpdateProhibited"/>
        </host:rem>
      </host:update>
    </update>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2303">
                      <msg>Object with given ID (ns99.holy.cow) could not be updated</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCMvFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should perform a host delete operation', fakeAsync(() => {
    service.deleteHost('ns99.holy.cow').then(result => {
      expect(result.code).toBe('1001');
      expect(result.message).toBe('Command completed successfully; action pending');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <host:delete xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns99.holy.cow</host:name>
      </host:delete>
    </delete>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1001">
                      <msg>Command completed successfully; action pending</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCMvFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should handle host delete error', fakeAsync(() => {
    service.deleteHost('ns4.holy.cow').then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result, null, 2));
    }).catch(err => {
      expect(err.code).toBe('2303');
      expect(err.message).toBe('Object with given ID (ns4.holy.cow) could not be deleted');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <host:delete xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>ns4.holy.cow</host:name>
      </host:delete>
    </delete>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:host="urn:ietf:params:xml:ns:host-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2303">
                      <msg>Object with given ID (ns4.holy.cow) could not be deleted</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCMvFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));
});
