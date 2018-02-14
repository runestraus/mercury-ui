import * as domainepp from './domainepp.template';

describe('Domain EPP Templates', () => {
  it('should generate a domain transfer command', () => {
    expect(domainepp.domainTransfer('foo.com', 'TEST-1234', 'abc123', 'request')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <transfer op="request">
      <domain:transfer xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:transfer>
    </transfer>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain transfer command with null authorization pw', () => {
    expect(domainepp.domainTransfer('foo.com', 'TEST-1234', null, 'request')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <transfer op="request">
      <domain:transfer xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
      </domain:transfer>
    </transfer>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain info command', () => {
    expect(domainepp.domainInfo('foo.com', 'TEST-1234', 'abc123')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <domain:info xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name hosts="all">foo.com</domain:name>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:info>
    </info>
    <extension>
      <fee:info xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
          <fee:currency>USD</fee:currency>
          <fee:command>renew</fee:command>
          <fee:period unit="y">1</fee:period>
      </fee:info>
    </extension>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain check command', () => {
    expect(domainepp.domainCheck('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <domain:check xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
      </domain:check>
    </check>
    <extension>
      <fee:check xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
        <fee:domain>
          <fee:name>foo.com</fee:name>
          <fee:command>create</fee:command>
        </fee:domain>
        <fee:domain>
          <fee:name>foo.com</fee:name>
          <fee:command>renew</fee:command>
        </fee:domain>
        <fee:domain>
          <fee:name>foo.com</fee:name>
          <fee:command>transfer</fee:command>
        </fee:domain>
        <fee:domain>
          <fee:name>foo.com</fee:name>
          <fee:command>restore</fee:command>
        </fee:domain>
      </fee:check>
    </extension>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain create command', () => {
    const domainInfo = {
      clientId: 'brodaddy',
      fullyQualifiedDomainName: 'foo.com',
      registrationPeriod: '1',
      authInfo: 'abc123',
      domainNameserversArray: undefined,
    };
    expect(domainepp.domainCreate(domainInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain create command with nameservers', () => {
    const domainInfo = {
      clientId: 'brodaddy',
      fullyQualifiedDomainName: 'foo.com',
      registrationPeriod: '1',
      authInfo: 'abc123',
      domainNameserversArray: ['ns1.foo.com', 'ns2.foo.com'],
    };
    expect(domainepp.domainCreate(domainInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:ns>
          <domain:hostObj>ns1.foo.com</domain:hostObj>
          <domain:hostObj>ns2.foo.com</domain:hostObj>
        </domain:ns>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain create command with registrant contact', () => {
    const domainInfo = {
      clientId: 'brodaddy',
      fullyQualifiedDomainName: 'foo.com',
      registrationPeriod: '1',
      authInfo: 'abc123',
      registrantContact: 'the-registrant',
      domainNameserversArray: undefined,
    };
    expect(domainepp.domainCreate(domainInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:registrant>the-registrant</domain:registrant>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain create command with contacts list', () => {
    const domainInfo = {
      clientId: 'brodaddy',
      fullyQualifiedDomainName: 'foo.com',
      registrationPeriod: '1',
      authInfo: 'abc123',
      contacts: [
        {type: 'admin', value: 'the-admin'},
        {type: 'tech', value: 'the-tech'},
      ],
      domainNameserversArray: undefined,
    };
    expect(domainepp.domainCreate(domainInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:contact type="admin">the-admin</domain:contact>
        <domain:contact type="tech">the-tech</domain:contact>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain create command with premium price', () => {
    const domainInfo = {
      clientId: 'brodaddy',
      fullyQualifiedDomainName: 'foo.com',
      registrationPeriod: '1',
      authInfo: 'abc123',
      premiumCurrency: 'USD',
      premiumPrice: '200.00',
      domainNameserversArray: []
    };
    expect(domainepp.domainCreate(domainInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:period unit="y">1</domain:period>
        <domain:authInfo>
          <domain:pw>abc123</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    <extension>
      <fee:create xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
        <fee:currency>USD</fee:currency>
        <fee:fee>200.00</fee:fee>
      </fee:create>
    </extension>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
        });

  it('should generate a domain delete command', () => {
    expect(domainepp.domainDelete('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <domain:delete xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
      </domain:delete>
    </delete>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain renew command', () => {
    expect(domainepp.domainRenew('foo.com', '10-01-2001T00:00:00Z', '1', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <renew>
      <domain:renew
       xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:curExpDate>10-01-2001T00:00:00Z</domain:curExpDate>
        <domain:period unit="y">1</domain:period>
      </domain:renew>
    </renew>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain renew command with fee extension', () => {
    expect(domainepp.domainRenew('foo.com', '10-01-2001T00:00:00Z', '1', 'TEST-1234', '100.00', 'USD')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <renew>
      <domain:renew
       xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:curExpDate>10-01-2001T00:00:00Z</domain:curExpDate>
        <domain:period unit="y">1</domain:period>
      </domain:renew>
    </renew>
    <extension>
      <fee:renew xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
        <fee:currency>USD</fee:currency>
        <fee:fee>100.00</fee:fee>
      </fee:renew>
    </extension>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command', () => {
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with added hosts', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      addHosts: ['ns1.foo.com', 'ns2.foo.com'],
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:add>
          <domain:ns>
            <domain:hostObj>ns1.foo.com</domain:hostObj>
            <domain:hostObj>ns2.foo.com</domain:hostObj>
          </domain:ns>
        </domain:add>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with added contacts', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      addContacts: [
        {
          type: 'tech',
          value: 'tech-contact',
        },
        {
          type: 'admin',
          value: 'admin-contact',
        }
      ],
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:add>
          <domain:contact type="tech">tech-contact</domain:contact>
          <domain:contact type="admin">admin-contact</domain:contact>
        </domain:add>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with added statuses', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      addStatuses: ['serverUpdateProhibited', 'clientUpdateProhibited'],
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:add>
          <domain:status s="serverUpdateProhibited"/>
          <domain:status s="clientUpdateProhibited"/>
        </domain:add>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with removed hosts', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      remHosts: ['ns1.foo.com', 'ns2.foo.com'],
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:rem>
          <domain:ns>
            <domain:hostObj>ns1.foo.com</domain:hostObj>
            <domain:hostObj>ns2.foo.com</domain:hostObj>
          </domain:ns>
        </domain:rem>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with removed contacts', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      remContacts: [
        {
          type: 'tech',
          value: 'tech-contact',
        },
        {
          type: 'admin',
          value: 'admin-contact',
        }
      ],
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:rem>
          <domain:contact type="tech">tech-contact</domain:contact>
          <domain:contact type="admin">admin-contact</domain:contact>
        </domain:rem>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with removed statuses', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      remStatuses: ['serverUpdateProhibited', 'clientUpdateProhibited'],
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:rem>
          <domain:status s="serverUpdateProhibited"/>
          <domain:status s="clientUpdateProhibited"/>
        </domain:rem>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain update command with updated registrant', () => {
    const updateInfo: domainepp.DomainUpdateInfo = {
      changedElements: {
        changed: true,
        registrant: 'new-registrant',
      }
    };
    expect(domainepp.domainUpdate('foo.com', 'TEST-1234', updateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:chg>
          <domain:registrant>new-registrant</domain:registrant>
        </domain:chg>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain restore request command', () => {
    expect(domainepp.domainRestore('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="urn:ietf:params:xml:ns:epp-1.0
     epp-1.0.xsd">
  <command>
    <update>
      <domain:update
          xmlns:domain="urn:ietf:params:xml:ns:domain-1.0"
          xsi:schemaLocation="urn:ietf:params:xml:ns:domain-1.0
          domain-1.0.xsd">
        <domain:name>foo.com</domain:name>
        <domain:chg/>
      </domain:update>
    </update>
    <extension>
      <rgp:update xmlns:rgp="urn:ietf:params:xml:ns:rgp-1.0"
          xsi:schemaLocation="urn:ietf:params:xml:ns:rgp-1.0
          rgp-1.0.xsd">
        <rgp:restore op="request"/>
      </rgp:update>
    </extension>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain status update command', () => {
    expect(domainepp.domainStatusUpdate('foo.com', 'TEST-1234', [], [])).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain status update command with added statuses', () => {
    expect(domainepp.domainStatusUpdate(
      'foo.com', 'TEST-1234', ['serverUpdateProhibited', 'clientUpdateProhibited'], [])).toBe(
    `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:add>
          <domain:status s="serverUpdateProhibited"/>
          <domain:status s="clientUpdateProhibited"/>
        </domain:add>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a domain status update command with removed statuses', () => {
    expect(domainepp.domainStatusUpdate(
      'foo.com', 'TEST-1234', [], ['serverUpdateProhibited', 'clientUpdateProhibited'])).toBe(
    `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>foo.com</domain:name>
        <domain:rem>
          <domain:status s="serverUpdateProhibited"/>
          <domain:status s="clientUpdateProhibited"/>
        </domain:rem>
      </domain:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });
});
