import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainDetail } from '../../model/domain.model';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomainEppService } from '../../service/domain-epp.service';
import { getParentRouteUrl } from '../../shared/routeutils';
import { ContactDetail } from '../contact.model';
import { ContactEppService } from '../contactepp.service';
import { DomainUpdateInfo } from '../../epp/domainepp.template';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  domainName: string;
  domainDetail: DomainDetail;
  showUpdateContacts = true;
  loading = true;
  error: string = null;
  createDomain = false;
  validAndChanged = false;
  contacts: { [key: string]: ContactDetail } = {};
  contactForm: FormGroup;
  formErrors = {
    'registrant': '',
    'admin': '',
    'tech': '',
    'billing': '',
  };
  validationMessages = {
    'registrant': {
      'required': 'registrant is required.',
    'contactExists': 'must be a valid contact ID'
    },
    'admin': {
      'required': 'admin is required.',
      'contactExists': 'must be a valid contact ID'
    },
      'tech': {
        'required': 'tech is required.',
      'contactExists': 'must be a valid contact ID'
    },
    'billing': {
      'contactExists': 'must be a valid contact ID'
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domainEppService: DomainEppService,
    private contactEppService: ContactEppService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.domainName = this.route.snapshot.params['domainName'];
    this.getDomain();
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
      this.createDomain = false;
      this.contactForm.setValue({
        'registrant': this.domainDetail.contacts['registrant'] || '',
        'admin': this.domainDetail.contacts['admin'] || '',
        'tech': this.domainDetail.contacts['tech'] || '',
        'billing': this.domainDetail.contacts['billing'] || '',
      });
      Object.keys(this.domainDetail.contacts).forEach((key) => {
        const contactId = this.domainDetail.contacts[key];
        this.contactEppService.infoContact(contactId).then((contactDetail) => {
          this.contacts[contactId] = contactDetail;
        }).catch((err) => {
          if (err.code && err.message) {
            this.formErrors[key] = err.message;
          } else {
            console.error(err);
            this.formErrors[key] = `There was an error getting ${key} contact info`;
          }
        });
      });
    this.contactExists(this.contactForm.get('registrant'));
    this.contactExists(this.contactForm.get('admin'));
    this.contactExists(this.contactForm.get('tech'));
    this.contactExists(this.contactForm.get('billing'));
    this.contactForm.valueChanges
      .subscribe(() => this.onValueChanged());
    }).catch(err => {
      this.loading = false;
      // switch these blocks of code to test out the partial domain info display
      if (err.code && err.message) {
        this.error = err.message;
      } else {
        console.error(err);
        this.error = 'There was an error getting domain info';
      }
    });
  }

  onCloseClicked() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  getContactDisplayValue(contactType: string): string {
    const contactId: string = this.domainDetail.contacts[contactType];
    if (!contactId || !this.contacts[contactId]) {
      return '';
    }
    const contact: ContactDetail = this.contacts[contactId];
    if (contact.postalInfo) {
      const postalInfo = contact.postalInfo[0];
      return `${postalInfo.name} - ${postalInfo.address.city}, ${postalInfo.address.countryCode}`;
    }
    return contact.contactId;
  }

  createNewContact(contactType: string): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  editExistingContact(contactType: string): void {
    this.router.navigate(['edit', this.domainDetail.contacts[contactType]], { relativeTo: this.route });
  }

  contactExists(formControl: AbstractControl) {
    formControl.valueChanges
      .filter(val => val.length >= 2)
      .debounceTime(500)
      .switchMap(data => this.contactEppService.checkContact(data))
      .subscribe(res => {
        if (res.avail) {
          formControl.setErrors({ contactExists: true });
          this.onValueChanged();
        }
      },
      (err) => {
        formControl.setErrors(err.message);
        this.onValueChanged();
      });
  }

  /**
  * Updates formErrors object with validation messages when form changes.
  */
  onValueChanged() {
    if (!this.contactForm) { return; }
  const diff = this.getContactsDiff();
  if (!diff.addContacts && !diff.remContacts && !diff.changedElements) { return; }
    const form = this.contactForm;
    Object.keys(this.formErrors).map(field => {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors).map(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }

  createForm() {
    this.contactForm = this.fb.group({
      registrant: [{ value: ''}, Validators.required],
      admin: [{ value: '' }, Validators.required],
      tech: [{ value: '' }, Validators.required],
      billing: [{ value: '' }]
    });
  }

  submitable(): boolean {
    const diff = this.getContactsDiff();
    this.error = '';
    if (!(diff.changedElements) && !(diff.addContacts) && !(diff.remContacts)) {
      return;
    }
    return this.contactForm.valid;
  }

  onSubmit() {
    const diff = this.getContactsDiff();
    this.error = '';
    if (!this.contactForm.valid) {
      return;
  } else if (diff.changedElements || diff.addContacts || diff.remContacts) {
    this.domainEppService.update(this.domainDetail.fullyQualifiedDomainName, diff).catch((err) => {
      this.error = err.message;
    }).then(() => {
      if (this.error === '') {
        this.onCloseClicked();
      }
    });
    } else {
    this.error = 'No changes have been made';
    }
  }

  getContactsDiff(): DomainUpdateInfo {
    const diff = {};
    const formModel = this.contactForm.value;
    for (const contactType of ['admin', 'tech', 'billing']) {
      const prevVal = this.domainDetail.contacts[contactType];
      const currentVal = formModel[contactType];
      if ( prevVal !== currentVal) {
        if (currentVal) {
          if (!diff['addContacts']) {
            diff['addContacts'] = [];
          }
          diff['addContacts'].push({
            type: contactType,
            value: currentVal
          });
        }
        if (prevVal) {
          if (!diff['remContacts']) {
            diff['remContacts'] = [];
            }
          diff['remContacts'].push({
            type: contactType,
            value: prevVal
          });
        }
      };
    }
    if (this.domainDetail.contacts['registrant'] !== formModel['registrant'] && formModel['registrant'].length) {
      diff['changedElements'] = {
        registrant: formModel['registrant']
      };
    }
    return diff as DomainUpdateInfo;
  }
}
