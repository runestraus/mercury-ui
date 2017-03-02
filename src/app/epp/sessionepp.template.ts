import * as Handlebars from 'handlebars';

/** Handlebars template for session login command */
const LOGIN_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <login>
      <clID>{{clId}}</clID>
      <pw>{{pw}}</pw>
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
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Login request.
 *
 * @param clId Registrar clientId
 * @param pw Password
 * @param clTrid Client transaction id
 */
export function sessionLogin(clId: string, pw: string, clTrid: string): string {
  return LOGIN_TEMPLATE({clId: clId, pw: pw, clTrid: clTrid});
}

const LOGOUT_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <logout/>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Logout request.
 *
 * @param clTrid Client transaction id
 */
export function sessionLogout(clTrid: string): string {
  return LOGOUT_TEMPLATE({clTrid: clTrid});
}
