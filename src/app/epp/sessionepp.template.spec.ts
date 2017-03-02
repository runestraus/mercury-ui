import * as sessionepp from './sessionepp.template';

describe('Session EPP Templates', () => {
  it('should generate a login command', () => {
    expect(sessionepp.sessionLogin('RegistrarX', 'foo123', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <login>
      <clID>RegistrarX</clID>
      <pw>foo123</pw>
      <options>
        <version>1.0</version>
        <lang>en</lang>
      </options>
      <svcs>
        <objURI>urn:ietf:params:xml:ns:host-1.0</objURI>
        <objURI>urn:ietf:params:xml:ns:domain-1.0</objURI>
        <objURI>urn:ietf:params:xml:ns:contact-1.0</objURI>
        <svcExtension>
          <extURI>urn:ietf:params:xml:ns:launch-1.0</extURI>
          <extURI>urn:ietf:params:xml:ns:rgp-1.0</extURI>
          <extURI>urn:ietf:params:xml:ns:fee-0.6</extURI>
        </svcExtension>
      </svcs>
    </login>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a logout command', () => {
    expect(sessionepp.sessionLogout('TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <logout/>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });
});
