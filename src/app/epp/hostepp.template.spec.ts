import * as hostepp from './hostepp.template';

describe('Host EPP Templates', () => {
  it('should generate a host create command', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
    };
    expect(hostepp.hostCreate(hostInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
      </host:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host create command with ipv4 addresses', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:addr': [
        {
          value: '127.0.0.1',
        }
      ],
    };
    expect(hostepp.hostCreate(hostInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
            <host:addr ip="v4">127.0.0.1</host:addr>
      </host:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host create command with ipv6 addresses', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:addr': [
        {
          value: '::1',
        }
      ],
    };
    expect(hostepp.hostCreate(hostInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
            <host:addr ip="v6">::1</host:addr>
      </host:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host update command', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:chgName': 'foo.bar.com',
    };
    expect(hostepp.hostUpdate(hostInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
      </host:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host update command with rename', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:chgName': 'foo.bar.xyz',
    };
    expect(hostepp.hostUpdate(hostInfo, 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
          <host:chg>
            <host:name>foo.bar.xyz</host:name>
          </host:chg>
      </host:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host update command with added addrs', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:chgName': 'foo.bar.com',
    };
    const hostUpdateInfo: hostepp.HostUpdateInfo = {
      addAddrs: [
        {value: '127.0.0.1'},
        {value: '::1'},
      ],
    };
    expect(hostepp.hostUpdate(hostInfo, 'TEST-1234', hostUpdateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
        <host:add>
          <host:addr ip="v4">127.0.0.1</host:addr>
          <host:addr ip="v6">::1</host:addr>
        </host:add>
      </host:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host update command with removed addrs', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:chgName': 'foo.bar.com',
    };
    const hostUpdateInfo: hostepp.HostUpdateInfo = {
      remAddrs: [
        {value: '127.0.0.1'},
        {value: '::1'},
      ],
    };
    expect(hostepp.hostUpdate(hostInfo, 'TEST-1234', hostUpdateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
        <host:rem>
          <host:addr ip="v4">127.0.0.1</host:addr>
          <host:addr ip="v6">::1</host:addr>
        </host:rem>
      </host:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host update command with added statuses', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:chgName': 'foo.bar.com',
    };
    const hostUpdateInfo: hostepp.HostUpdateInfo = {
      addStatuses: ['serverUpdateProhibted', 'clientUpdateProhibited'],
    };
    expect(hostepp.hostUpdate(hostInfo, 'TEST-1234', hostUpdateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
        <host:add>
          <host:status s="serverUpdateProhibted"/>
          <host:status s="clientUpdateProhibited"/>
        </host:add>
      </host:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host update command with removed statuses', () => {
    const hostInfo = {
      'host:name': 'foo.bar.com',
      'host:chgName': 'foo.bar.com',
    };
    const hostUpdateInfo: hostepp.HostUpdateInfo = {
      remStatuses: ['serverUpdateProhibted', 'clientUpdateProhibited'],
    };
    expect(hostepp.hostUpdate(hostInfo, 'TEST-1234', hostUpdateInfo)).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.bar.com</host:name>
        <host:rem>
          <host:status s="serverUpdateProhibted"/>
          <host:status s="clientUpdateProhibited"/>
        </host:rem>
      </host:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host info command', () => {
    expect(hostepp.hostInfo('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <host:info xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.com</host:name>
      </host:info>
    </info>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host check command', () => {
    expect(hostepp.hostCheck('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <host:check xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.com</host:name>
      </host:check>
    </check>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate a host delete command', () => {
    expect(hostepp.hostDelete('foo.com', 'TEST-1234')).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <host:delete xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>foo.com</host:name>
      </host:delete>
    </delete>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });
});
