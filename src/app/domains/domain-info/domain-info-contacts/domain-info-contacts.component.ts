import { Component, OnInit, Input } from '@angular/core';

import { ContactDetail } from '../../../contacts/contact.model';
import { ContactEppService } from '../../../contacts/contactepp.service';
import { DomainDetail } from '../../../model/domain.model';

@Component({
  selector: 'app-domain-info-contacts',
  templateUrl: './domain-info-contacts.component.html',
  styleUrls: ['./domain-info-contacts.component.css']
})
export class DomainInfoContactsComponent implements OnInit {

  @Input() domain: DomainDetail;
  contacts: Array<ContactDetail> = [];
  contactTypes: { [key: string]: Array<string> } = {};

  constructor(private contactEppService: ContactEppService) { }

  ngOnInit() {
    const domainContacts = this.domain.contacts;
    // Keep a set of ids that are loading to avoid duplicates
    const loadingContacts = new Set<string>();
    for (const contactType in domainContacts) {
      if (!domainContacts.hasOwnProperty(contactType)) {
        continue;
      }
      const contactId = domainContacts[contactType];

      // Create a reverse mapping of contact id to list of contact types
      this.contactTypes[contactId] = this.contactTypes[contactId] || [];
      this.contactTypes[contactId].push(contactType);
      // deterministic ordering of contact type
      this.contactTypes[contactId].sort();
      if (!loadingContacts.has(contactId)) {
        loadingContacts.add(contactId);
        this.contactEppService.infoContact(contactId).then(contactDetail => {
          this.contacts.push(contactDetail);
        });
      }
    }
  }

  getContactDisplayValue(contact: ContactDetail): string {
    if (contact.postalInfo) {
      const postalInfo = contact.postalInfo[0];
      return `${postalInfo.name} - ${postalInfo.address.city}, ${postalInfo.address.countryCode}`;
    }
    return contact.contactId;
  };

  getContactTypes(contact: ContactDetail): string {
    return this.contactTypes[contact.contactId].join(', ');
  }

  openUpdateContactsDialog(): void {
    alert('Not yet implemented');
  }

  openUpdateContactDialog(contact: ContactDetail): void {
    alert('Not yet implemented');
  }
}
