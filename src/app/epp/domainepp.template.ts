import * as Handlebars from 'handlebars';
import * as helpers from './helpers.template';
import { DomainInfo } from '../model/domain.model';

// load helpers module
helpers.init();

/** Reusable template fragment for adding/removing items */
const ADDREM_TEMPLATE = Handlebars.compile(
  `<{{tagName}}>
          {{#if hosts}}
          <domain:ns>
            {{#each hosts}}
            <domain:hostObj>{{this}}</domain:hostObj>
            {{/each}}
          </domain:ns>
          {{/if}}
          {{#if contacts}}
            {{#each contacts}}
          <domain:contact type="{{type}}">{{value}}</domain:contact>
            {{/each}}
          {{/if}}
          {{#if statuses}}
            {{#each statuses}}
          <domain:status s="{{this}}"/>
            {{/each}}
          {{/if}}
        </{{tagName}}>`);

// Enable {{addRemDomain ... }} in templates
Handlebars.registerHelper('addRemDomain', function(
  isAdd: boolean, hosts: Array<string>, contacts: Array<ContactInfo>, statuses: Array<string>,
): any {
  const tagName = isAdd ? 'domain:add' : 'domain:rem';
  // The return value from the handlebars template is safe
  return new Handlebars.SafeString(ADDREM_TEMPLATE({
    isAdd: isAdd, hosts: hosts, contacts: contacts, statuses: statuses, tagName: tagName,
  }));
});

/** Reusable template fragment for adding/removing statuses */
const ADDREM_SERVER_STATUS_TEMPLATE = Handlebars.compile(
  `<{{tagName}}>
            {{#each statuses}}
          <domain:status s="{{this}}"/>
            {{/each}}
        </{{tagName}}>`);

// Enable {{addRemDomainStatus .. }} in templates
Handlebars.registerHelper('addRemDomainServerStatus', function(isAdd: boolean, statuses: Array<string>){
  const tagName = isAdd ? 'domain:add' : 'domain:rem';
  // The return value from the handlebars template is safe
  return new Handlebars.SafeString(
    ADDREM_SERVER_STATUS_TEMPLATE({isAdd: isAdd, statuses: statuses, tagName: tagName}));
});

/** Handlebars template for domain transfer commands */
const TRANSFER_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <transfer op="{{op}}">
      <domain:transfer xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{name}}</domain:name>
        {{#ifNonnull authorizationCode}}
        <domain:authInfo>
          <domain:pw>{{authorizationCode}}</domain:pw>
        </domain:authInfo>
        {{/ifNonnull}}
      </domain:transfer>
    </transfer>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain transfer request.
 *
 * @param name Fully qualified domain name
 * @param clTrid Client transaction id
 * @param authorizationCode Authorization password
 * @param op Type of operation. One of (request|approve|reject)
 */
export function domainTransfer(
  name: string, clTrid: string, authorizationCode: string, op: string
): string {
  return TRANSFER_TEMPLATE({
    name: name,
    clTrid: clTrid,
    authorizationCode: authorizationCode,
    op: op,
  });
}

/** Handlebars template for domain info commands */
const INFO_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <domain:info xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name hosts="all">{{name}}</domain:name>
        {{#ifNonnull authorizationCode}}
        <domain:authInfo>
          <domain:pw>{{authorizationCode}}</domain:pw>
        </domain:authInfo>
        {{/ifNonnull}}
      </domain:info>
    </info>
    <extension>
      <fee:info xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
          <fee:currency>USD</fee:currency>
          <fee:command>renew</fee:command>
          <fee:period unit="y">1</fee:period>
      </fee:info>
    </extension>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain info request.
 *
 * @param name Fully qualified domain name
 * @param clTrid Client transaction id
 * @param authorizationCode Authorization password
 */
export function domainInfo(name: string, clTrid: string, authorizationCode: string): string {
  return INFO_TEMPLATE({name: name, clTrid: clTrid, authorizationCode: authorizationCode});
}

/** Handlebars template for domain check commands */
const CHECK_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <domain:check xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{name}}</domain:name>
      </domain:check>
    </check>
    <extension>
      <fee:check xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
        <fee:domain>
          <fee:name>{{name}}</fee:name>
          <fee:command>create</fee:command>
        </fee:domain>
        <fee:domain>
          <fee:name>{{name}}</fee:name>
          <fee:command>renew</fee:command>
        </fee:domain>
        <fee:domain>
          <fee:name>{{name}}</fee:name>
          <fee:command>transfer</fee:command>
        </fee:domain>
        <fee:domain>
          <fee:name>{{name}}</fee:name>
          <fee:command>restore</fee:command>
        </fee:domain>
      </fee:check>
    </extension>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain check request.
 *
 * @param name Fully qualified domain name
 * @param clTrid Client transaction id
 */
export function domainCheck(name: string, clTrid: string): string {
  return CHECK_TEMPLATE({name: name, clTrid: clTrid});
}

/** Handlebars template for domain create commands */
const CREATE_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <domain:create xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{item.fullyQualifiedDomainName}}</domain:name>
        <domain:period unit="y">{{item.registrationPeriod}}</domain:period>
        {{#if item.domainNameserversArray}}
        <domain:ns>
          {{#each item.domainNameserversArray}}
          <domain:hostObj>{{this}}</domain:hostObj>
          {{/each}}
        </domain:ns>
        {{/if}}
        {{#ifNonnull item.registrantContact}}
        <domain:registrant>{{item.registrantContact}}</domain:registrant>
        {{/ifNonnull}}
        {{#ifNonnull item.contacts}}
          {{#each item.contacts}}
        <domain:contact type="{{type}}">{{value}}</domain:contact>
          {{/each}}
        {{/ifNonnull}}
        <domain:authInfo>
          <domain:pw>{{item.authInfo}}</domain:pw>
        </domain:authInfo>
      </domain:create>
    </create>
    {{#ifNonnull item.premiumPrice}}
    <extension>
      <fee:create xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
        <fee:currency>{{item.premiumCurrency}}</fee:currency>
        <fee:fee>{{item.premiumPrice}}</fee:fee>
      </fee:create>
    </extension>
    {{/ifNonnull}}
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

// TODO: (wolfgang) Add an interface DomainInfo for item
/**
 * Domain create request.
 *
 * @param item Domain creation data
 * @param clTrid Client transaction id
 */
export function domainCreate(item: DomainInfo, clTrid: string): string {
  return CREATE_TEMPLATE({item: item, clTrid: clTrid});
}

/** Handlebars template for domain delete commands */
const DELETE_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <domain:delete xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{name}}</domain:name>
      </domain:delete>
    </delete>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain delete request.
 *
 * @param name Fully qualified domain name
 * @param clTrid Client transaction id
 */
export function domainDelete(name: string, clTrid: string): string {
  return DELETE_TEMPLATE({name: name, clTrid: clTrid});
}

/** Handlebars template for domain renew commands */
const DOMAIN_RENEW_TEMPLATE = Handlebars.compile(`<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <renew>
      <domain:renew
       xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{name}}</domain:name>
        <domain:curExpDate>{{currentExpirationDate}}</domain:curExpDate>
        <domain:period unit="y">{{newRegistrationPeriod}}</domain:period>
      </domain:renew>
    </renew>
    {{#ifNonnull renewPrice}}
    <extension>
      <fee:renew xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
        <fee:currency>{{renewCurrency}}</fee:currency>
        <fee:fee>{{renewPrice}}</fee:fee>
      </fee:renew>
    </extension>
    {{/ifNonnull}}
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain renew request.
 *
 * @param name Fully qualified domain name
 * @param currentExpirationDate Current expiration date of the domain
 * @param newRegistrationPeriod New registration period, in years
 * @param clTrid Client transaction id
 * @param renewPrice? Price to renew domain
 * @param renewCurrency? Currency of renew price
 */
export function domainRenew(
  name: string,
  currentExpirationDate: string,
  newRegistrationPeriod: string,
  clTrid: string,
  renewPrice?: string,
  renewCurrency?: string
): string {
  return DOMAIN_RENEW_TEMPLATE({
    name: name,
    currentExpirationDate: currentExpirationDate,
    newRegistrationPeriod: newRegistrationPeriod,
    clTrid: clTrid,
    renewPrice: renewPrice,
    renewCurrency: renewCurrency,
  });
}

/** Handlebars template for domain update commands */
const UPDATE_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{name}}</domain:name>
        {{#if itemsAdded}}
        {{addRemDomain true addHosts addContacts addStatuses}}
        {{/if}}
        {{#if itemsRemoved}}
        {{addRemDomain false remHosts remContacts remStatuses}}
        {{/if}}
        {{#if changedElements.changed}}
        <domain:chg>
          <domain:registrant>{{changedElements.registrant}}</domain:registrant>
        </domain:chg>
        {{/if}}
      </domain:update>
    </update>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/** Contains a list of elements that were changed. Currently only registrant is used. */
export interface ChangedElements {
  /** Set to true if any items have changed */
  changed: boolean;
  /** Set to the value of the new registrant */
  registrant: string;
}

/** Represents a contact that can be added to or removed from a domain */
export interface ContactInfo {
  /** Type of contact (registrant|tech|admin) */
  type: string;
  /** Id of contact to add or remove */
  value: string;
}

/** Represents the items that should be updated in a domain:update request */
export interface DomainUpdateInfo {
  /** Added hosts */
  addHosts?: Array<string>;
  /** Removed hosts */
  remHosts?: Array<string>;
  /** Added contacts */
  addContacts?: Array<ContactInfo>;
  /** Removed contacts */
  remContacts?: Array<ContactInfo>;
  /** Added statuses */
  addStatuses?: Array<string>;
  /** Removed statuses */
  remStatuses?: Array<string>;
  /** Updated elements */
  changedElements?: ChangedElements;
}

/**
 * Domain update request.
 *
 * @param name Fully qualified domain name.
 * @param clTrid Client transaction id
 * @param updateInfo? list of domain updates.
 */
export function domainUpdate(
  name: string,
  clTrid: string,
  updateInfo?: DomainUpdateInfo,
): string {
  updateInfo = updateInfo || {};
  // Set flags to conditionally render parts of the template
  const itemsAdded = updateInfo.addContacts || updateInfo.addStatuses || updateInfo.addHosts;
  const itemsRemoved = updateInfo.remContacts || updateInfo.remStatuses || updateInfo.remHosts;
  return UPDATE_TEMPLATE({
    name: name,
    clTrid: clTrid,
    addHosts: updateInfo.addHosts,
    remHosts: updateInfo.remHosts,
    addContacts: updateInfo.addContacts,
    remContacts: updateInfo.remContacts,
    addStatuses: updateInfo.addStatuses,
    remStatuses: updateInfo.remStatuses,
    changedElements: updateInfo.changedElements,
    itemsAdded: itemsAdded,
    itemsRemoved: itemsRemoved,
  });
}

/** Handlebars template for domain restore request commands */
const RESTORE_TEMPLATE = Handlebars.compile(
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
        <domain:name>{{name}}</domain:name>
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
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain restore request.
 *
 * This is for domain restore requests without a report
 * so that the rgp:restore op attribute is always "request"
 *
 * @param name Fully qualified domain name
 * @param clTrid Client transaction id
 */
export function domainRestore(name: string, clTrid: string): string {
  return RESTORE_TEMPLATE({name: name, clTrid: clTrid});
}

/** Handlebars template for domain status update commands */
const STATUS_UPDATE_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <domain:update xmlns:domain="urn:ietf:params:xml:ns:domain-1.0">
        <domain:name>{{name}}</domain:name>
        {{#if addStatuses}}
        {{addRemDomainServerStatus true addStatuses}}
        {{/if}}
        {{#if remStatuses}}
        {{addRemDomainServerStatus false remStatuses}}
        {{/if}}
      </domain:update>
    </update>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Domain status update request.
 *
 * @param name Fully qualified domain name
 * @param clTrid Client transaction id
 * @param addStatuses list of statuses to add.
 * @param remStatuses list of statuses to remove.
 */
export function domainStatusUpdate(
  name: string, clTrid: string, addStatuses: Array<string>, remStatuses: Array<string>
) {
  return STATUS_UPDATE_TEMPLATE({
    name: name, clTrid: clTrid, addStatuses: addStatuses, remStatuses: remStatuses
  });
}
