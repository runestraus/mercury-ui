import { ContactEppService } from './contactepp.service';
import { ContactDetail } from './contact.model';
import { HttpClient } from '../shared/http.client';
import { TextStringService } from '../service/textstring.service';
import { EppHelperService } from '../epp/epphelper.service';

import { async, fakeAsync, tick } from '@angular/core/testing';
import { TestBed, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  HttpModule, XHRBackend, RequestMethod, Response, ResponseOptions
} from '@angular/http';
import { OAuthService } from 'angular-oauth2-oidc';

describe('A ContactEppService', () => {
  let mockBackend: MockBackend;
  let service: ContactEppService;
  let lastConnection: any;
  const mockOauthService = {
    getAccessToken: jasmine.createSpy('getAccessToken')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ContactEppService, EppHelperService, HttpClient, TextStringService,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: OAuthService, useValue: mockOauthService }
      ]
    });
  });

  beforeEach(
    inject(
      [XHRBackend, ContactEppService],
      (_mockBackend: MockBackend, _service: ContactEppService) => {
    mockBackend = _mockBackend;
    service = _service;
    mockBackend.connections.subscribe(
      (connection: any) => lastConnection = connection);
  }));

  afterEach(() => {
    lastConnection = null;
  });

  it('should perform a contact info operation', fakeAsync(() => {
    service.infoContact('donutz').then(contact => {
      expect(contact.contactId).toBe('donutz');
      expect(contact.repoId).toBe('1524991-ROID');
      expect(contact.status).toEqual(['linked', 'ok']);
      expect(contact.postalInfo.length).toBe(1);
      expect(contact.postalInfo[0].name).toBe('Do Nutz');
      expect(contact.postalInfo[0].org).toBe('Do Nutz Organization');
      expect(contact.postalInfo[0].address.street1).toBe('123 Main Ave.');
      expect(contact.postalInfo[0].address.street2).toBe('Suite 666');
      expect(contact.postalInfo[0].address.street3).toBe('BOAB');
      expect(contact.postalInfo[0].address.city).toBe('Seattle');
      expect(contact.postalInfo[0].address.state).toBe('WA');
      expect(contact.postalInfo[0].address.zip).toBe('98107');
      expect(contact.postalInfo[0].address.countryCode).toBe('US');
      expect(contact.voice).toBe('+1.2223334444');
      expect(contact.voiceExtension).toBe('');
      expect(contact.fax).toBe('+1.2223334455');
      expect(contact.faxExtension).toBe('');
      expect(contact.email).toBe('do@nutz.com');
      expect(contact.currentSponsorClientId).toBe('tldsrus');
      expect(contact.creationClientId).toBe('tldsrus');
      expect(contact.creationTime).toBe('2016-05-20T20:52:44Z');
      expect(contact.lastEppUpdateClientId).toBe('tldsrus');
      expect(contact.lastEppUpdateTime).toBe('2016-08-11T17:49:25Z');
      expect(contact.authInfo.pw).toBe('12345');
      expect(contact.disclose).toBeNull();
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <contact:info xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
      </contact:info>
    </info>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
                xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <resData>
                      <contact:infData>
                          <contact:id>donutz</contact:id>
                          <contact:roid>1524991-ROID</contact:roid>
                          <contact:status s="linked"/>
                          <contact:status s="ok"/>
                          <contact:postalInfo type="int">
                              <contact:name>Do Nutz</contact:name>
                              <contact:org>Do Nutz Organization</contact:org>
                              <contact:addr>
                                  <contact:street>123 Main Ave.</contact:street>
                                  <contact:street>Suite 666</contact:street>
                                  <contact:street>BOAB</contact:street>
                                  <contact:city>Seattle</contact:city>
                                  <contact:sp>WA</contact:sp>
                                  <contact:pc>98107</contact:pc>
                                  <contact:cc>US</contact:cc>
                              </contact:addr>
                          </contact:postalInfo>
                          <contact:voice>+1.2223334444</contact:voice>
                          <contact:fax>+1.2223334455</contact:fax>
                          <contact:email>do@nutz.com</contact:email>
                          <contact:clID>tldsrus</contact:clID>
                          <contact:crID>tldsrus</contact:crID>
                          <contact:crDate>2016-05-20T20:52:44Z</contact:crDate>
                          <contact:upID>tldsrus</contact:upID>
                          <contact:upDate>2016-08-11T17:49:25Z</contact:upDate>
                          <contact:authInfo>
                              <contact:pw>12345</contact:pw>
                          </contact:authInfo>
                      </contact:infData>
                  </resData>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>G2Q86dukRgyISAMGY/Hygw==-12</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
    tick();
  }));

  it('should handle contact info error', fakeAsync(() => {
    service.infoContact('donutz').then(contact => {
      fail('Expected error but got result: ' + JSON.stringify(contact));
    }).catch(err => {
      expect(err.code).toBe('2303');
      expect(err.message).toBe(
        'The contact with given ID (nodonutz) doesn\'t exist.');
    });

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
            xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2303">
                      <msg>The contact with given ID (nodonutz) doesn't exist.</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>G2Q86dukRgyISAMGY/Hygw==-12</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
    tick();
  }));

  it('should perform a contact check operation (available)', fakeAsync(() => {
    service.checkContact('nodonutz').then(result => {
      expect(result.contactId).toBe('nodonutz');
      expect(result.avail).toBe(true);
      expect(result.reason).toBe('');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <contact:check xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>nodonutz</contact:id>
      </contact:check>
    </check>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
                xmlns="urn:ietf:params:xml:ns:epp-1.0">
            <response>
                <result code="1000">
                    <msg>Command completed successfully</msg>
                </result>
                <resData>
                    <contact:chkData>
                        <contact:cd>
                            <contact:id avail="true">nodonutz</contact:id>
                        </contact:cd>
                    </contact:chkData>
                </resData>
                <trID>
                    <clTRID>WBP-00000</clTRID>
                    <svTRID>MEcrHvWATXuz+Nsb6Op+ew==-23</svTRID>
                </trID>
            </response>
          </epp>`
    })));
  }));

  it('should perform a contact check operation (unavailable)', fakeAsync(() => {
    service.checkContact('donutz').then(result => {
      expect(result.contactId).toBe('donutz');
      expect(result.avail).toBe(false);
      expect(result.reason).toBe('In use');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <contact:check xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
      </contact:check>
    </check>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
                xmlns="urn:ietf:params:xml:ns:epp-1.0">
            <response>
                <result code="1000">
                    <msg>Command completed successfully</msg>
                </result>
                <resData>
                    <contact:chkData>
                        <contact:cd>
                            <contact:id avail="false">donutz</contact:id>
                            <contact:reason>In use</contact:reason>
                        </contact:cd>
                    </contact:chkData>
                </resData>
                <trID>
                    <clTRID>WBP-00000</clTRID>
                    <svTRID>MEcrHvWATXuz+Nsb6Op+ew==-23</svTRID>
                </trID>
            </response>
          </epp>`
    })));
  }));

  it('should perform a contact delete operation', fakeAsync(() => {
    service.deleteContact('donutz').then(result => {
      expect(result.code).toBe('1001');
      expect(result.message).toBe(
        'Command completed successfully; action pending');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <contact:delete xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
      </contact:delete>
    </delete>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1001">
                      <msg>Command completed successfully; action pending</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should handle contact delete error', fakeAsync(() => {
    service.deleteContact('donutz').then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result));
    }).catch(err => {
      expect(err.code).toBe('2303');
      expect(err.message).toBe(
        'Object with given ID (donutz) could not be deleted');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <contact:delete xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
      </contact:delete>
    </delete>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2303">
                      <msg>Object with given ID (donutz) could not be deleted</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));

  it('should perform a contact update operation', fakeAsync(() => {
    const contactInfo = {
      contactId: 'donutz',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      }
    };
    service.updateContact(contactInfo).then(result => {
      expect(result.code).toBe('1000');
      expect(result.message).toBe('Command completed successfully');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
        <contact:chg>
          <contact:voice>+1.7034444444</contact:voice>
          <contact:fax>+1.7035555556</contact:fax>
          <contact:email>jdoe@example.com</contact:email>
          <contact:authInfo>
            <contact:pw>2fooBAR</contact:pw>
          </contact:authInfo>
        </contact:chg>
      </contact:update>
    </update>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
      })));
    }));

  it('should handle contact update error', fakeAsync(() => {
    const contactInfo = {
      contactId: 'donutzdelete',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      }
    };
    service.updateContact(contactInfo).then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result, null, 2));
    }).catch(err => {
      expect(err.code).toBe('2302');
      expect(err.message).toBe(
        'Object with given ID (donutsdelete) could not be updated');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutzdelete</contact:id>
        <contact:chg>
          <contact:voice>+1.7034444444</contact:voice>
          <contact:fax>+1.7035555556</contact:fax>
          <contact:email>jdoe@example.com</contact:email>
          <contact:authInfo>
            <contact:pw>2fooBAR</contact:pw>
          </contact:authInfo>
        </contact:chg>
      </contact:update>
    </update>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2302">
                      <msg>Object with given ID (donutsdelete) could not be updated</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
      })));
    }));

  it('should perform a contact updateStatus operation', fakeAsync(() => {
    service.updateContactStatus(
      'donutz', ['clientUpdateProhibited'], ['serverUpdateProhibited']
    ).then(result => {
      expect(result.code).toBe('1000');
      expect(result.message).toBe('Command completed successfully');
    });

    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
          <contact:add>
              <contact:status s="clientUpdateProhibited"/>
          </contact:add>
          <contact:rem>
              <contact:status s="serverUpdateProhibited"/>
          </contact:rem>
      </contact:update>
    </update>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
            xmlns="urn:ietf:params:xml:ns:epp-1.0">
            <response>
                <result code="1000">
                    <msg>Command completed successfully</msg>
                </result>
                <trID>
                    <clTRID>WBP-00000</clTRID>
                    <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                </trID>
            </response>
        </epp>`
    })));
  }));

  it('should handle a contact updateStatus error', fakeAsync(() => {
    service.updateContactStatus(
      'donutz', ['clientUpdateProhibited'], ['serverUpdateProhibited']
    ).then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result, null, 2));
    }).catch(err => {
      expect(err.code).toBe('2302');
      expect(err.message).toBe(
        'Object with given ID (donutsdelete) could not be updated');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
          <contact:add>
              <contact:status s="clientUpdateProhibited"/>
          </contact:add>
          <contact:rem>
              <contact:status s="serverUpdateProhibited"/>
          </contact:rem>
      </contact:update>
    </update>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2302">
                      <msg>Object with given ID (donutsdelete) could not be updated</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
      })));
  }));

  it('should perform a contact create operation', fakeAsync(() => {
    const contactInfo = {
      contactId: 'donutz',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      }
    };
    service.createContact(contactInfo).then(result => {
      expect(result.code).toBe('1000');
      expect(result.message).toBe('Command completed successfully');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutz</contact:id>
        <contact:voice>+1.7034444444</contact:voice>
        <contact:fax>+1.7035555556</contact:fax>
        <contact:email>jdoe@example.com</contact:email>
        <contact:authInfo>
          <contact:pw>2fooBAR</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="1000">
                      <msg>Command completed successfully</msg>
                  </result>
                  <resData>
                      <contact:creData>
                          <contact:id>donutz</contact:id>
                          <contact:crDate>2016-09-20T19:54:35Z</contact:crDate>
                      </contact:creData>
                  </resData>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));

  }));

  it('should handle contact create error', fakeAsync(() => {
    const contactInfo = {
      contactId: 'donutsfail',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      }
    };
    service.createContact(contactInfo).then(result => {
      fail('Expected error but got result: ' + JSON.stringify(result, null, 2));
    }).catch(err => {
      expect(err.code).toBe('2302');
      expect(err.message).toBe(
        'Object with given ID (donutsfail) already exists');
    });
    expect(lastConnection == null).toBe(false);
    expect(lastConnection.request.getBody()).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>donutsfail</contact:id>
        <contact:voice>+1.7034444444</contact:voice>
        <contact:fax>+1.7035555556</contact:fax>
        <contact:email>jdoe@example.com</contact:email>
        <contact:authInfo>
          <contact:pw>2fooBAR</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>WBP-00000</clTRID>
  </command>
</epp>`);

    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
              xmlns="urn:ietf:params:xml:ns:epp-1.0">
              <response>
                  <result code="2302">
                      <msg>Object with given ID (donutsfail) already exists</msg>
                  </result>
                  <trID>
                      <clTRID>WBP-00000</clTRID>
                      <svTRID>CajFDj0OSd2QVEqCM+vFTQ==-b</svTRID>
                  </trID>
              </response>
          </epp>`
    })));
  }));
});
