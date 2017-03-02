
export interface ContactCheckResponse {
  contactId: string;
  reason: string;
  avail: boolean;
}

export interface ContactPostalInfo {
  type: string;
  name: string;
  org: string;
  address: ContactAddress;
}

export interface ContactAddress {
  city: string;
  countryCode: string;
  state: string;
  street1: string;
  street2?: string;
  street3?: string;
  zip: string;
}

export interface ContactAuthInfo {
  pw: string;
}

export interface ContactDisclose {
  name?: string;
  org?: string;
  addr?: string;
  voice?: string;
  fax?: string;
  email?: string;
  flag?: number;
}

export interface ContactDetail {
  contactId: string;
  repoId: string;
  status: Array<string>;
  postalInfo: Array<ContactPostalInfo>;
  voice: string;
  voiceExtension: string;
  fax: string;
  faxExtension: string;
  email: string;
  currentSponsorClientId: string;
  creationClientId: string;
  creationTime: string;
  lastEppUpdateClientId: string;
  lastEppUpdateTime: string;
  lastTransferTime: string;
  authInfo: ContactAuthInfo;
  disclose: ContactDisclose;
}
