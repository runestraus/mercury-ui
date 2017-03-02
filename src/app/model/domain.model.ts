
import { Contact } from './contact.model';
import { Host } from './host.model';

export class Domain {
  domainName: string;
  status: string;
  systemTags: string;
  tld: string;
  price: any;
  priceCategory: string;
  iannaNumber: number;
  registrar: string;
  currentSponsorClientId: string;
  contacts: Contact[];
  hosts: Host[];
}
