import * as Handlebars from 'handlebars';

const CHECK_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <contact:check xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>{{id}}</contact:id>
      </contact:check>
    </check>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Contact check request.
 *
 * @param clTrid
 * @param id The contact id.
 */
export function contactCheck(id: string, clTrid: string): string {
  return CHECK_TEMPLATE({clTrid: clTrid, id: id});
}

const INFO_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <contact:info xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>{{id}}</contact:id>
      </contact:info>
    </info>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Contact info request.
 *
 * @param id The contact id
 * @param clTrid
 */
export function contactInfo(id: string, clTrid: string): string {
  return INFO_TEMPLATE({clTrid: clTrid, id: id});
}

const CREATE_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <contact:create xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>{{item.contactId}}</contact:id>
        {{#each item.postalInfo}}
        <contact:postalInfo type="{{type}}">
          <contact:name>{{name}}</contact:name>
          <contact:org>{{org}}</contact:org>
          <contact:addr>
            <contact:street>{{street1}}</contact:street>
            <contact:street>{{street2}}</contact:street>
            <contact:street>{{street3}}</contact:street>
            <contact:city>{{city}}</contact:city>
            <contact:sp>{{state}}</contact:sp>
            <contact:pc>{{zip}}</contact:pc>
            <contact:cc>{{countryCode}}</contact:cc>
          </contact:addr>
        </contact:postalInfo>
        {{/each}}
        <contact:voice{{#if item.voiceExtension}} x="{{item.voiceExtension}}"{{/if}}>{{item.voice}}</contact:voice>
        <contact:fax{{#if item.faxExtension}} x="{{item.faxExtension}}"{{/if}}>{{item.fax}}</contact:fax>
        <contact:email>{{item.email}}</contact:email>
        <contact:authInfo>
          <contact:pw>{{item.authInfo.pw}}</contact:pw>
        </contact:authInfo>
      </contact:create>
    </create>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/* XXX: The first postalInfo is type "int" and second is "loc" if it is
 *      present, for compatibility with the server. */
/**
 * Contact create request.

 * @param item
 * @param clTrid
 */
export function contactCreate(item: any, clTrid: string): string {
  return CREATE_TEMPLATE({clTrid: clTrid, item: item});
}

const UPDATE_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>{{item.contactId}}</contact:id>
        <contact:chg>
          {{#each item.postalInfo}}
          <contact:postalInfo type="{{type}}">
            <contact:name>{{name}}</contact:name>
            <contact:org>{{org}}</contact:org>
            <contact:addr>
              <contact:street>{{street1}}</contact:street>
              <contact:street>{{street2}}</contact:street>
              <contact:street>{{street3}}</contact:street>
              <contact:city>{{city}}</contact:city>
              <contact:sp>{{state}}</contact:sp>
              <contact:pc>{{zip}}</contact:pc>
              <contact:cc>{{countryCode}}</contact:cc>
            </contact:addr>
          </contact:postalInfo>
          {{/each}}
          <contact:voice{{#if item.voiceExtension}} x="{{item.voiceExtension}}"{{/if}}>{{item.voice}}</contact:voice>
          <contact:fax{{#if item.faxExtension}} x="{{item.faxExtension}}"{{/if}}>{{item.fax}}</contact:fax>
          <contact:email>{{item.email}}</contact:email>
          <contact:authInfo>
            <contact:pw>{{item.authInfo.pw}}</contact:pw>
          </contact:authInfo>
        </contact:chg>
      </contact:update>
    </update>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/* XXX: The first postalInfo is type "int" and second is "loc" if it is
 *      present, for compatibility with the server. */
/**
 * Contact update request.
 * add x attribute for extensions when necessary/present
 *
 * @param item
 * @param clTrid
 */
export function contactUpdate(item: any, clTrid: string): string {
  return UPDATE_TEMPLATE({clTrid: clTrid, item: item});
}

const DELETE_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <contact:delete xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>{{id}}</contact:id>
      </contact:delete>
    </delete>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Contact delete request.
 *
 * @param id
 * @param clTrid
 */
export function contactDelete(id: string, clTrid: string): string {
  return DELETE_TEMPLATE({clTrid: clTrid, id: id});
}

const UPDATE_STATUS_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <contact:update xmlns:contact="urn:ietf:params:xml:ns:contact-1.0">
        <contact:id>{{id}}</contact:id>
        {{#if addStatuses}}
          <contact:add>
            {{#each addStatuses}}
              <contact:status s="{{this}}"/>
            {{/each}}
          </contact:add>
        {{/if}}
        {{#if remStatuses}}
          <contact:rem>
            {{#each remStatuses}}
              <contact:status s="{{this}}"/>
            {{/each}}
          </contact:rem>
        {{/if}}
      </contact:update>
    </update>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Contact status update request.
 *
 * @param id
 * @param addStatuses list of statuses to add.
 * @param remStatuses list of statuses to remove.
 * @param clTrid
 */
export function contactUpdateStatus(
  id: string, clTrid: string, addStatuses: Array<string>, remStatuses: Array<string>
) {
  return UPDATE_STATUS_TEMPLATE({
    clTrid: clTrid, id: id, addStatuses: addStatuses, remStatuses: remStatuses
  });
}
