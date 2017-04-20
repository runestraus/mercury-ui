import { ContactAddress } from '../contacts/contact.model';

export class Registrar {
  registrarName: string;
  password?: string;
  email?: string;
  url?: string;
  phone?: string;
  fax?: string;
  type: string;
  state: string;
  driveFolderId?: string;
  allowedTlds: string[];
  ipWhiteList?: string[];
  ianaId: string;
  billingId: string;
  billingMethod: string;
  address: ContactAddress;
  blockPremiumNames: boolean;
  contactsRequireSyncing: boolean;
  phonePasscode: string;
  icannReferralEmail: string;
  whoisServer: string;
}
