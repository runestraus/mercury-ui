
import { Contact } from './contact.model';
import { Host } from './host.model';
import { Money } from './money.model';

export class Domain {
  domainName: string;
  status: string;
  systemTags: string;
  tld: string;
  price: Money;
  priceCategory: string;
  ianaNumber: number;
  registrar: string;
  currentSponsorClientId: string;
  contacts: Contact[];
  hosts: Host[];
}

export class DomainInfo {
  clientId: string;
  fullyQualifiedDomainName: string;
  registrationPeriod: string;
  domainNameserversArray: string[];
  registrantContact?: string;
  contacts?: any[];
  authInfo: string;
  smdSignature?: string;
  fee?: string;
  premiumPrice?: string;
  premiumCurrency?: string;
}

export class DomainDetail {
  fullyQualifiedDomainName: string;
  status: string[];
  repoId: string;
  currentSponsorClientId: string;
  creationClientId: string;
  creationTime: string;
  lastEppUpdateClientId?: string;
  lastEppUpdateTime?: string;
  lastTransferTime?: string;
  registrationExpirationTime: string;
  authInfo: string;
  nameservers: string[];
  subordinateHosts: string[];
  contacts: { [key: string]: string };
  rgpStatus: string;
  domainPrices: DomainPrices;
}

export class DomainAuthInfo {
  pw: string;
}

export class DomainPrices {
  class: string;
  prices: { [key: string]: DomainPrice };
}

export class DomainPrice {
  currency: string;
  period: string;
  periodUnit: string;
  fee: { [key: string]: string };
}

export class TransferDetail {
  name: string;
  trStatus: string;
  reID: string;
  reDate: string;
  acID: string;
  acDate: string;
  exDate: string;
}
