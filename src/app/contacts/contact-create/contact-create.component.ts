import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from '../../validators/customValidator';
import { ContactEppService } from '../contactepp.service';
import { MeService } from '../../service/me.service';
import { Md5 } from 'ts-md5/dist/md5';
import { COUNTRIES } from '../../model/country.model';
import { ActivatedRoute } from '@angular/router';
import { ContactDetail } from '../contact.model';

/**
 * Component to create or update a contact.
 *
 * To edit a contact a `contactId` param must be provided in the url otherwise a create contact form will be prepared.
 */
@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {
  showDialog = true;
  contactForm: FormGroup;
  error: string;
  contact: any;
  useSystemContactId = true;
  availableCountries = COUNTRIES;
  isEditForm = false;
  modalHeader = 'Create New Contact';
  previousContact: ContactDetail;
  formErrors = {
    'id': '',
    'name': '',
    'email': '',
    'city': '',
    'countryCode': '',
  };

  validationMessages = {
    'id': {
      'required': 'Contact id is required.'
    },
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email address is required.',
      'validateEmailAddress': 'Valid email address is required.'
    },
    'city': {
      'required': 'City is required.'
    },
    'countryCode': {
      'required': 'Country code is required.'
    }
  };

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private contactEppService: ContactEppService,
              private meService: MeService) { }

  ngOnInit() {
    this.createForm();
    const contactId = this.route.snapshot.params['contactId'];
        if (contactId) {
          this.modalHeader = 'Edit Contact';
          this.isEditForm = true;
          this.contactForm.get('id').enable();
          this.contactEppService.infoContact(contactId)
            .then(contact => {
              this.previousContact = contact;
              this.contactForm.setValue({
                id: contact.contactId,
                name: contact.postalInfo[0].name,
                email: contact.email,
                street1: contact.postalInfo[0].address.street1,
                street2: contact.postalInfo[0].address.street2,
                street3: contact.postalInfo[0].address.street3,
                city: contact.postalInfo[0].address.city,
                state: contact.postalInfo[0].address.state,
                zip: contact.postalInfo[0].address.zip,
                countryCode: contact.postalInfo[0].address.countryCode,
                phone: contact.voice,
                fax: contact.fax
              });
            });
        } else {
          this.meService.get()
            .then(user => {
              this.generateContactId(user.clientId);
            });
        }
  }

  /**
   * Gets current contact from form and submits to update or create.
   */
  onSubmit() {
    const contactCreated = this.prepareSaveContact();
    if (this.isEditForm) {
      this.contactEppService.updateContact(contactCreated)
        .then(contact => {
          this.contact = contact;
          this.showDialog = false;
          this.contactForm.reset();
        }).catch(error => {
          this.error = error.message;
      });
    } else {
      this.contactEppService.createContact(contactCreated)
        .then(contact => {
          this.contact = contact;
          this.showDialog = false;
          this.contactForm.reset();
        }).catch(error => {
        this.error = error.message;
      });
    }
  }

  createForm() {
    this.contactForm = this.fb.group({
      id: [{value: '', disabled: this.useSystemContactId}, Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidator.validateEmailAddress]],
      street1: [''],
      street2: [''],
      street3: [''],
      city: ['', Validators.required],
      state: [''],
      zip: [''],
      countryCode: ['US', Validators.required],
      phone: [''],
      fax: ['']
    });

    this.contactForm.valueChanges
      .subscribe(() => this.onValueChanged());

    this.onValueChanged();
  }

  /**
   * Returns a contact created from the current form model.
   */
  prepareSaveContact() {
    this.contactForm.get('id').enable();
    const formModel = this.contactForm.value;
    return {
      contactId: formModel.id,
      postalInfo: [
        {
          type: 'loc',
          name: formModel.name,
          street1: formModel.street1,
          street2: formModel.street2,
          street3: formModel.street3,
          city: formModel.city,
          state: formModel.state,
          zip: formModel.zip,
          countryCode: formModel.countryCode
        }
      ],
      email: formModel.email,
      voice: formModel.phone,
      fax: formModel.fax
    };
  }

  /**
   * Updates formErrors object with validation messages when form changes.
   */
  onValueChanged() {
    if (!this.contactForm) { return; }
    const form = this.contactForm;

    Object.keys(this.formErrors).map(field => {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors).map(key =>  {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }

  private generateContactId(clientId: string) {
    const random = Md5.hashStr(Math.random() + Date().toString());
    const generatedContactId = clientId + '-' + random;
    this.contactForm.patchValue({ id: generatedContactId.slice(0, 16) });
  }

  customizeContactId() {
    this.useSystemContactId = false;
    this.contactForm.get('id').enable();
  }
}
