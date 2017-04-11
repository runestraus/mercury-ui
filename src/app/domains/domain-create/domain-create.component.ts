import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { DomainEppService } from '../../service/domain-epp.service';
import { DomainCheck, DomainInfo } from '../../model/domain.model';
import { SessionService } from '../../service/session.service';
import { User } from '../../model/user.model';
import { ContactEppService } from '../../contacts/contactepp.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'app-domain-create',
  templateUrl: './domain-create.component.html',
  styleUrls: ['./domain-create.component.css']
})
export class DomainCreateComponent implements OnInit {
  readonly registrationPeriods = [
    { value: '1', label: '1 year'},
    { value: '2', label: '2 year'},
    { value: '3', label: '3 year'},
    { value: '4', label: '4 year'},
    { value: '5', label: '5 year'},
    { value: '6', label: '6 year'},
    { value: '7', label: '7 year'},
    { value: '8', label: '8 year'},
    { value: '9', label: '9 year'},
    { value: '10', label: '10 year'}
  ];
  @Input() domainName: string;
  @Output() onCreated = new EventEmitter();
  domainForm: FormGroup;
  private _user: User;
  domainCheck: DomainCheck;
  isPremium = false;
  error: string = null;

  formErrors = {
    'registrantContact': '',
    'adminContact': '',
    'techContact': '',
    'billingContact': '',
    'premiumConfirmation': ''
  };

  validationMessages = {
    'registrantContact': {
      'required': 'Registrant Contact is required.',
      'contactExists': 'Existing contact is required.'
    },
    'adminContact': {
      'required': 'Admin Contact is required.',
      'contactExists': 'Existing contact is required.'
    },
    'techContact': {
      'required': 'Tech Contact is required.',
      'contactExists': 'Existing contact is required.'
    },
    'billingContact': {
      'required': 'Billing Contact is required.',
      'contactExists': 'Existing contact is required.'
    },
    'premiumConfirmation': {
      'required': 'Confirmation of premium price is required.'
    }
  };

  constructor(private fb: FormBuilder,
              private domainService: DomainEppService,
              private sessionService: SessionService,
              private contactService: ContactEppService) {
  }

  ngOnInit() {
    this.createForm();
    this.sessionService.getCurrentUser()
      .then(user => {
        this._user = user.user;
        return this.domainService.check(this.domainName);
      })
      .then(check => {
        this.domainCheck = check;
        if (this.domainCheck.domainPrices['create'] !== undefined) {
          this.isPremium = this.domainCheck.domainPrices['create'].feeClass === 'premium';
        }
        this.requireOnPremium();
      })
      .catch(err => {
        this.error = err.error;
      });
  }

  onSubmit() {
    const domainCreated = this.prepareSaveDomain();
    this.domainService.create(domainCreated)
      .then(() => {
        this.onCreated.emit();
      });
  }

  prepareSaveDomain(): DomainInfo {
    const formModel = this.domainForm.value;
    const contacts = [
      { type: 'admin', value: formModel.adminContact },
      { type: 'tech', value: formModel.techContact },
      { type: 'billing', value: formModel.billingContact }
    ];
    const domainInfo = {
      clientId: this._user.clientId,
      fullyQualifiedDomainName: this.domainName,
      registrationPeriod: formModel.registrationPeriod,
      domainNameserversArray: [],
      authInfo: '',
      contacts: contacts,
      registrantContact: formModel.registrantContact
    } as DomainInfo;
    if (this.isPremium) {
      domainInfo.premiumPrice = this.domainCheck.domainPrices['create'].fee['create'];
      domainInfo.premiumCurrency = this.domainCheck.domainPrices['create'].currency;
    }
    return domainInfo;
  }

  addContact(contactType: string) {

  }

  contactExists(formControl: AbstractControl) {
    formControl.valueChanges
      .filter(val => val.length >= 2)
      .debounceTime(500)
      .switchMap(data => this.contactService.checkContact(data))
      .subscribe(res => {
        if (res.avail) {
          formControl.setErrors({ contactExists: true});
          this.onValueChanged();
        }
      },
        () => {
          formControl.setErrors({ contactExists: true});
          this.onValueChanged();
      });
  }

  requireOnPremium() {
    if (this.isPremium) {
      this.domainForm.get('premiumConfirmation').setValidators(Validators.required);
    }
  }

  createForm() {
    this.domainForm = this.fb.group({
      registrationPeriod: ['1'],
      registrantContact: ['', [Validators.required]],
      adminContact: ['', [Validators.required]],
      techContact: ['', [Validators.required]],
      billingContact: ['', [Validators.required]],
      premiumConfirmation: ['']
    });
    this.contactExists(this.domainForm.get('registrantContact'));
    this.contactExists(this.domainForm.get('adminContact'));
    this.contactExists(this.domainForm.get('techContact'));
    this.contactExists(this.domainForm.get('billingContact'));
    this.domainForm.valueChanges
      .subscribe(() => this.onValueChanged());

    this.onValueChanged();
  }

  /**
   * Updates formErrors object with validation messages when form changes.
   */
  onValueChanged() {
    if (!this.domainForm) { return; }
    const form = this.domainForm;
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
}
