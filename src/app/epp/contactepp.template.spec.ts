import * as contactepp from './contactepp.template';

/** Contact EPP Template spec */
describe('Contact EPP Templates', () => {

  it('should generate an epp check command', () => {
    expect(contactepp.contactCheck('my-contact', 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <contact:check xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
      </contact:check>
    </check>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp info command', () => {
    expect(contactepp.contactInfo('my-contact', 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <contact:info xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
      </contact:info>
    </info>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp create command', () => {
    const contactInfo = {
      contactId: 'my-contact',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      }
    };
    expect(contactepp.contactCreate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:voice>+1.7034444444</contact:voice>
        <contact:fax>+1.7035555556</contact:fax>
        <contact:email>jdoe@example.com</contact:email>
        <contact:authInfo>
          <contact:pw>2fooBAR</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp create command with fax and voice extensions', () => {
      const contactInfo = {
        contactId: 'my-contact',
        voice: '+1.7034444444',
        voiceExtension: '1234',
        fax: '+1.7035555556',
        faxExtension: '1234',
        email: 'jdoe@example.com',
        authInfo: {
          pw: '2fooBAR',
        }
      };
      expect(contactepp.contactCreate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:voice x="1234">+1.7034444444</contact:voice>
        <contact:fax x="1234">+1.7035555556</contact:fax>
        <contact:email>jdoe@example.com</contact:email>
        <contact:authInfo>
          <contact:pw>2fooBAR</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
    });

  it('should generate an epp create command with a single address', () => {
    const contactInfo = {
      contactId: 'my-contact',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      },
      postalInfo: [
        {
          type: 'int',
          name: 'John Doe',
          org: 'Foobar Corp',
          street1: '123 foo street',
          street2: 'Apartment 13',
          street3: 'Section 2',
          city: 'Seattle',
          state: 'Washington',
          zip: '12345',
          countryCode: 'US',
        }
      ],
    };
    expect(contactepp.contactCreate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:postalInfo type="int">
          <contact:name>John Doe</contact:name>
          <contact:org>Foobar Corp</contact:org>
          <contact:addr>
            <contact:street>123 foo street</contact:street>
            <contact:street>Apartment 13</contact:street>
            <contact:street>Section 2</contact:street>
            <contact:city>Seattle</contact:city>
            <contact:sp>Washington</contact:sp>
            <contact:pc>12345</contact:pc>
            <contact:cc>US</contact:cc>
          </contact:addr>
        </contact:postalInfo>
        <contact:voice>+1.7034444444</contact:voice>
        <contact:fax>+1.7035555556</contact:fax>
        <contact:email>jdoe@example.com</contact:email>
        <contact:authInfo>
          <contact:pw>2fooBAR</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp create command with a multiple addresses', () => {
    const contactInfo = {
      contactId: 'my-contact',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      },
      postalInfo: [
        {
          type: 'int',
          name: 'John Doe',
          org: 'Foobar Corp',
          street1: '123 foo street',
          street2: 'Apartment 13',
          street3: 'Section 2',
          city: 'Seattle',
          state: 'Washington',
          zip: '12345',
          countryCode: 'US',
        },
        {
          type: 'loc',
          name: 'John Doe',
          org: 'Foobar Corp',
          street1: '123 foo street',
          street2: 'Apartment 13',
          street3: 'Section 2',
          city: 'Seattle',
          state: 'Washington',
          zip: '12345',
          countryCode: 'US',
        }
      ],
    };
    expect(contactepp.contactCreate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:postalInfo type="int">
          <contact:name>John Doe</contact:name>
          <contact:org>Foobar Corp</contact:org>
          <contact:addr>
            <contact:street>123 foo street</contact:street>
            <contact:street>Apartment 13</contact:street>
            <contact:street>Section 2</contact:street>
            <contact:city>Seattle</contact:city>
            <contact:sp>Washington</contact:sp>
            <contact:pc>12345</contact:pc>
            <contact:cc>US</contact:cc>
          </contact:addr>
        </contact:postalInfo>
        <contact:postalInfo type="loc">
          <contact:name>John Doe</contact:name>
          <contact:org>Foobar Corp</contact:org>
          <contact:addr>
            <contact:street>123 foo street</contact:street>
            <contact:street>Apartment 13</contact:street>
            <contact:street>Section 2</contact:street>
            <contact:city>Seattle</contact:city>
            <contact:sp>Washington</contact:sp>
            <contact:pc>12345</contact:pc>
            <contact:cc>US</contact:cc>
          </contact:addr>
        </contact:postalInfo>
        <contact:voice>+1.7034444444</contact:voice>
        <contact:fax>+1.7035555556</contact:fax>
        <contact:email>jdoe@example.com</contact:email>
        <contact:authInfo>
          <contact:pw>2fooBAR</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp update command', () => {
    const contactInfo = {
      contactId: 'my-contact',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      }
    };
    expect(contactepp.contactUpdate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
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
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

// TODO: test all these other cases, and the other functions as well.

  it('should generate an epp update command with fax and voice extensions', () => {
      const contactInfo = {
        contactId: 'my-contact',
        voice: '+1.7034444444',
        voiceExtension: '1234',
        fax: '+1.7035555556',
        faxExtension: '1234',
        email: 'jdoe@example.com',
        authInfo: {
          pw: '2fooBAR',
        }
      };
      expect(contactepp.contactUpdate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:chg>
          <contact:voice x="1234">+1.7034444444</contact:voice>
          <contact:fax x="1234">+1.7035555556</contact:fax>
          <contact:email>jdoe@example.com</contact:email>
          <contact:authInfo>
            <contact:pw>2fooBAR</contact:pw>
          </contact:authInfo>
        </contact:chg>
      </contact:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
    });

  it('should generate an epp update command with a single address', () => {
    const contactInfo = {
      contactId: 'my-contact',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      },
      postalInfo: [
        {
          type: 'int',
          name: 'John Doe',
          org: 'Foobar Corp',
          street1: '123 foo street',
          street2: 'Apartment 13',
          street3: 'Section 2',
          city: 'Seattle',
          state: 'Washington',
          zip: '12345',
          countryCode: 'US',
        }
      ],
    };
    expect(contactepp.contactUpdate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:chg>
          <contact:postalInfo type="int">
            <contact:name>John Doe</contact:name>
            <contact:org>Foobar Corp</contact:org>
            <contact:addr>
              <contact:street>123 foo street</contact:street>
              <contact:street>Apartment 13</contact:street>
              <contact:street>Section 2</contact:street>
              <contact:city>Seattle</contact:city>
              <contact:sp>Washington</contact:sp>
              <contact:pc>12345</contact:pc>
              <contact:cc>US</contact:cc>
            </contact:addr>
          </contact:postalInfo>
          <contact:voice>+1.7034444444</contact:voice>
          <contact:fax>+1.7035555556</contact:fax>
          <contact:email>jdoe@example.com</contact:email>
          <contact:authInfo>
            <contact:pw>2fooBAR</contact:pw>
          </contact:authInfo>
        </contact:chg>
      </contact:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp update command with a multiple addresses', () => {
    const contactInfo = {
      contactId: 'my-contact',
      voice: '+1.7034444444',
      fax: '+1.7035555556',
      email: 'jdoe@example.com',
      authInfo: {
        pw: '2fooBAR',
      },
      postalInfo: [
        {
          type: 'int',
          name: 'John Doe',
          org: 'Foobar Corp',
          street1: '123 foo street',
          street2: 'Apartment 13',
          street3: 'Section 2',
          city: 'Seattle',
          state: 'Washington',
          zip: '12345',
          countryCode: 'US',
        },
        {
          type: 'loc',
          name: 'John Doe',
          org: 'Foobar Corp',
          street1: '123 foo street',
          street2: 'Apartment 13',
          street3: 'Section 2',
          city: 'Seattle',
          state: 'Washington',
          zip: '12345',
          countryCode: 'US',
        }
      ],
    };
    expect(contactepp.contactUpdate(contactInfo, 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
        <contact:chg>
          <contact:postalInfo type="int">
            <contact:name>John Doe</contact:name>
            <contact:org>Foobar Corp</contact:org>
            <contact:addr>
              <contact:street>123 foo street</contact:street>
              <contact:street>Apartment 13</contact:street>
              <contact:street>Section 2</contact:street>
              <contact:city>Seattle</contact:city>
              <contact:sp>Washington</contact:sp>
              <contact:pc>12345</contact:pc>
              <contact:cc>US</contact:cc>
            </contact:addr>
          </contact:postalInfo>
          <contact:postalInfo type="loc">
            <contact:name>John Doe</contact:name>
            <contact:org>Foobar Corp</contact:org>
            <contact:addr>
              <contact:street>123 foo street</contact:street>
              <contact:street>Apartment 13</contact:street>
              <contact:street>Section 2</contact:street>
              <contact:city>Seattle</contact:city>
              <contact:sp>Washington</contact:sp>
              <contact:pc>12345</contact:pc>
              <contact:cc>US</contact:cc>
            </contact:addr>
          </contact:postalInfo>
          <contact:voice>+1.7034444444</contact:voice>
          <contact:fax>+1.7035555556</contact:fax>
          <contact:email>jdoe@example.com</contact:email>
          <contact:authInfo>
            <contact:pw>2fooBAR</contact:pw>
          </contact:authInfo>
        </contact:chg>
      </contact:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp delete command', () => {
    expect(contactepp.contactDelete('my-contact', 'TEST-1234')).toBe(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <contact:delete xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
      </contact:delete>
    </delete>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it('should generate an epp update status command to remove statuses', () => {
    expect(contactepp.contactUpdateStatus('my-contact', 'TEST-1234', [], ['foo', 'bar'])).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
          <contact:rem>
              <contact:status s="foo"/>
              <contact:status s="bar"/>
          </contact:rem>
      </contact:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it ('should generate an epp update status command to add statuses', () => {
    expect(contactepp.contactUpdateStatus('my-contact', 'TEST-1234', ['foo', 'bar'], [])).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
          <contact:add>
              <contact:status s="foo"/>
              <contact:status s="bar"/>
          </contact:add>
      </contact:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });

  it ('should generate an epp update status command to add and remove statuses', () => {
    expect(contactepp.contactUpdateStatus('my-contact', 'TEST-1234', ['foo'], ['bar'])).toBe(
      `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>my-contact</contact:id>
          <contact:add>
              <contact:status s="foo"/>
          </contact:add>
          <contact:rem>
              <contact:status s="bar"/>
          </contact:rem>
      </contact:update>
    </update>
    <clTRID>TEST-1234</clTRID>
  </command>
</epp>`);
  });
});
