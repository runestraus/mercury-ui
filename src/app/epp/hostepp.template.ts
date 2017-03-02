import * as Handlebars from 'handlebars';
import * as helpers from './helpers.template';

// load helpers module
helpers.init();

/** Reusable template fragment for adding/removing items */
const ADDREM_TEMPLATE = Handlebars.compile(
  `<{{tagName}}>
        {{#if addrs}}
        {{#each addrs}}
          <host:addr ip="{{ipVersion value}}">{{value}}</host:addr>
        {{/each}}
        {{/if}}
        {{#if statuses}}
        {{#each statuses}}
          <host:status s="{{this}}"/>
        {{/each}}
        {{/if}}
        </{{tagName}}>`);

// Enable {{addRemHost ... }} in templates
Handlebars.registerHelper(
  'addRemHost', function(isAdd: boolean, addrs: Array<string>, statuses: Array<string>
): any {
  const tagName = isAdd ? 'host:add' : 'host:rem';
  // The return value from the handlebars template is safe
  return new Handlebars.SafeString(
    ADDREM_TEMPLATE({tagName: tagName, addrs: addrs, statuses: statuses}));
});

/** Handlebars template for host create commands */
const CREATE_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <create>
      <host:create xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>{{item.host:name}}</host:name>
        {{#ifNonnull item.host:addr}}
          {{#each item.host:addr}}
            <host:addr ip="{{ipVersion value}}">{{value}}</host:addr>
          {{/each}}
        {{/ifNonnull}}
      </host:create>
    </create>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

// TODO: (wolfgang) add a HostInfo type for item
/**
 * Host create request.
 * @param item Host creation data
 * @param clTrid Client transaction id
 */
export function hostCreate(item: any, clTrid: string): string {
  return CREATE_TEMPLATE({item: item, clTrid: clTrid});
}

/** Handlebars template for host update commands */
const UPDATE_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <update>
      <host:update xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>{{item.host:name}}</host:name>
        {{#if itemsAdded}}
        {{addRemHost true addAddrs addStatuses}}
        {{/if}}
        {{#if itemsRemoved}}
        {{addRemHost false remAddrs remStatuses}}
        {{/if}}
        {{#if nameChanged}}
          <host:chg>
            <host:name>{{item.host:chgName}}</host:name>
          </host:chg>
        {{/if}}
      </host:update>
    </update>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/** Represents the items that should be updated in a host:update request */
export interface HostUpdateInfo {
  addAddrs?: Array<AddrInfo>;
  remAddrs?: Array<AddrInfo>;
  addStatuses?: Array<string>;
  remStatuses?: Array<string>;
}

/** IP address info */
export interface AddrInfo {
  /** ipv4 or ipv6 address */
  value: string;
}

/**
 * Host update request.
 *
 * @param item Host name update info
 * @param clTrid Client transaction id
 * @param updateInfo? list of host updates
 */
export function hostUpdate(item: any, clTrid: string, updateInfo?: HostUpdateInfo): string {
  updateInfo = updateInfo || {};
  const itemsAdded = updateInfo.addAddrs || updateInfo.addStatuses;
  const itemsRemoved = updateInfo.remAddrs || updateInfo.remStatuses;
  const nameChanged = item['host:name'] !== item['host:chgName'];
  return UPDATE_TEMPLATE({
    item: item,
    clTrid: clTrid,
    itemsAdded: itemsAdded,
    itemsRemoved: itemsRemoved,
    nameChanged: nameChanged,
    addAddrs: updateInfo.addAddrs,
    remAddrs: updateInfo.remAddrs,
    addStatuses: updateInfo.addStatuses,
    remStatuses: updateInfo.remStatuses,
  });
}

/** Handlebars template for host info commands */
const INFO_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <info>
      <host:info xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>{{name}}</host:name>
      </host:info>
    </info>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Host info request.
 *
 * @param name Fully qualified host name
 * @param clTrid Client transaction id
 */
export function hostInfo(name: string, clTrid: string): string {
  return INFO_TEMPLATE({name: name, clTrid: clTrid});
}

/** Handlebars template for host check commands */
const CHECK_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <check>
      <host:check xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>{{name}}</host:name>
      </host:check>
    </check>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Host check request.
 *
 * @param name Fully qualified host name
 * @param clTrid Client transaction id
 */
export function hostCheck(name: string, clTrid: string): string {
  return CHECK_TEMPLATE({name: name, clTrid: clTrid});
}

/** Handlebars template for host delete commands */
const DELETE_TEMPLATE = Handlebars.compile(
  `<epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
  <command>
    <delete>
      <host:delete xmlns:host="urn:ietf:params:xml:ns:host-1.0">
        <host:name>{{name}}</host:name>
      </host:delete>
    </delete>
    <clTRID>{{clTrid}}</clTRID>
  </command>
</epp>`);

/**
 * Host delete request.
 *
 * @param name Fully qualified host name
 * @param clTrid Client transaction id
 */
export function hostDelete(name: string, clTrid: string): string {
  return DELETE_TEMPLATE({name: name, clTrid: clTrid});
}
