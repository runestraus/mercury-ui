import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute, RouterModule, RouterOutletMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EppMessageAndStatus } from '../../epp/epphelper.service';

import { DocQuery, createMockRoute } from '../../shared/testutils';

import { ContactsComponent } from './contacts.component';
import { ContactDetail } from '../contact.model';

import { DomainEppService } from '../../service/domain-epp.service';
import { DomainDetail } from '../../model/domain.model';
import { ContactEppService } from '../../contacts/contactepp.service';

class Page {
  query: DocQuery<ContactsComponent>;
  form: FormGroup;

  constructor(private fixture: ComponentFixture<ContactsComponent>) {
    this.query = new DocQuery(fixture);
  }

  hasContactForm(): boolean {
    return this.query.getElementByCss('#contactsForm') != null;
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#contactsError');
    return el ? el.nativeElement.textContent : null;
  }

  isLoading(): boolean {
    return this.query.getElementByCss('#contactsLoading') != null;
  }

  setContactId(contactType: string, id: string) {
    if (!this.form) {
      this.form = this.fixture.componentInstance.contactForm;
    }
    this.form.controls[contactType].patchValue(id, { emitEvent: true });
  }

  getContactInputText(contactType: string): string {
    if (!this.form) {
      this.form = this.fixture.componentInstance.contactForm;
    }
    return this.form.controls[contactType].value;
  }

  getContactErrorMsg(contactType: string): string {
    const el = this.query.getElementByCss('#' + contactType + 'Error');
    return el ? el.nativeElement.textContent : null;
  }

  getEditExistingText(contactType: string): string {
    const el = this.query.getElementByCss('#edit-existing-' + contactType);
    return el ? el.nativeElement.textContent : null;
  }

  clickEdit(contactType: string): void {
    this.query.getElementByCss('#edit-existing-' + contactType).nativeElement.click();
  }

  clickCreate(contactType: string): void {
    this.query.getElementByCss('#create-new-contact-' + contactType).nativeElement.click();
  }

  clickHeaderX(): void {
    this.query.getElementByCss('#buttonCloseX').nativeElement.click();
  }

  clickClose(): void {
    this.query.getElementByCss('#contactsClose').nativeElement.click();
  }

  submitDisabled(): boolean {
    return this.query.getElementByCss('#contactsSubmit').nativeElement.disabled;
  }

  clickSubmit(): void {
    this.query.getElementByCss('#contactsSubmit').nativeElement.click();
  }
}

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let page: Page;

  let mockDomainEppService;
  let mockContactEppService;
  let mockRouter;

  const mockRoute = createMockRoute(['search/holy.cow', 'domains/holy.com'], { 'domainName': 'holy.cow' });

  function resolveDomain(contacts: { [key: string]: string }) {
    mockDomainEppService.info.and.returnValue(Promise.resolve({
      fullyQualifiedDomainName: 'holy.cow',
      contacts: contacts,
      currentSponsorClientId: 'brodaddy',
    }));
  }

  function resolveDomainUpdate(eppMsg: EppMessageAndStatus) {
    mockDomainEppService.update.and.returnValue(Promise.resolve(eppMsg));
  }

  function resolveContact(contact) {
    mockContactEppService.infoContact.and.returnValue(Promise.resolve(
      contact
    ));
  }

  beforeEach(() => {
    // Return the promise immediately and resolve later
    mockContactEppService = {
      infoContact: jasmine.createSpy('infoContact'),
    };
    mockDomainEppService = {
      info: jasmine.createSpy('info'),
      update: jasmine.createSpy('update'),
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
    declarations: [ContactsComponent],
      providers: [
        RouterOutletMap,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: ContactEppService, useValue: mockContactEppService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
      imports: [
        RouterModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no form if the domainDetail resolved with an error', async(() => {
    const errMsg = 'bad domain info';
    mockDomainEppService.info.and.returnValue(Promise.reject({
      code: '2304',
      message: errMsg
    }));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toEqual(errMsg);
      expect(page.hasContactForm()).toBeFalsy();
    }).catch(err => fail(err));
  }));

  it('close should navigate back to domain info modal', async(() => {
    resolveDomain({});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickClose();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('x should navigate back to domain info modal', async(() => {
    resolveDomain({});
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickHeaderX();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  // editting existing contact
  it('registrant edit should navigate to :registrantid', async(() => {
    const contactType = 'registrant';
    const contactId = 'registrantId';
    const contactMap = {
      'registrant': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickEdit(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['edit', contactId], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('admin edit should navigate to :adminId', async(() => {
    const contactType = 'admin';
    const contactId = 'adminId';
    const contactMap = {
      'admin': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickEdit(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['edit', contactId], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('tech edit should navigate to :techId', async(() => {
    const contactType = 'tech';
    const contactId = 'techId';
    const contactMap = {
      'tech': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickEdit(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['edit', contactId], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('billing edit should navigate to :billingId', async(() => {
    const contactType = 'billing';
    const contactId = 'billingId';
    const contactMap = {
      'billing': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickEdit(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['edit', contactId], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  // creating a new contact
  it('registrant create should navigate to ', async(() => {
    const contactType = 'registrant';
    const contactId = 'registrantId';
    const contactMap = {
      'registrant': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCreate(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([ 'edit' ], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('admin create should navigate to ', async(() => {
    const contactType = 'admin';
    const contactId = 'adminId';
    const contactMap = {
      'admin': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCreate(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([ 'edit' ], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('tech create should navigate to ', async(() => {
    const contactType = 'tech';
    const contactId = 'techId';
    const contactMap = {
      'tech': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCreate(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([ 'edit' ], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('billing create should navigate to ', async(() => {
    const contactType = 'billing';
    const contactId = 'billingId';
    const contactMap = {
      'billing': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Ricky Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'US'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCreate(contactType);
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith([ 'edit' ], { relativeTo: mockRoute });
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  // proper id displaying
  it('registrant should display id correctly', async(() => {
    const contactType = 'registrant';
    const contactId = 'registrantId';
    const contactMap = {
      'registrant': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Registrant Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Regellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'RE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getEditExistingText(contactType)).toEqual(
        contact.postalInfo[0].name + ' - ' + contact.postalInfo[0].address.city + ', ' + contact.postalInfo[0].address.countryCode
      );
    }).catch(err => fail(err));
  }));

  it('admin should display id correctly', async(() => {
    const contactType = 'admin';
    const contactId = 'adminId';
    const contactMap = {
      'admin': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Admin Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Adminellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'AD'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getEditExistingText(contactType)).toEqual(
        contact.postalInfo[0].name + ' - ' + contact.postalInfo[0].address.city + ', ' + contact.postalInfo[0].address.countryCode
      );
    }).catch(err => fail(err));
  }));

  it('tech should display id correctly', async(() => {
    const contactType = 'tech';
    const contactId = 'techId';
    const contactMap = {
      'tech': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Tech Bobby',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Techellevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'TE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getEditExistingText(contactType)).toEqual(
        contact.postalInfo[0].name + ' - ' + contact.postalInfo[0].address.city + ', ' + contact.postalInfo[0].address.countryCode
      );
    }).catch(err => fail(err));
  }));

  it('billing should display id correctly', async(() => {
    const contactType = 'billing';
    const contactId = 'billingId';
    const contactMap = {
      'billing': contactId,
    };
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
      email: 'something@donuts.email',
      postalInfo: [{
        name: 'Billy Bobbing',
        address: {
          street1: '123 Main St',
          street2: '',
          street3: '',
          city: 'Billevue',
          state: 'WA',
          zip: '98002',
          countryCode: 'BI'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getEditExistingText(contactType)).toEqual(
        contact.postalInfo[0].name + ' - ' + contact.postalInfo[0].address.city + ', ' + contact.postalInfo[0].address.countryCode
      );
    }).catch(err => fail(err));
  }));

  it('billing should not be displayed when no billing contact is in the domain', async(() => {
    const contactType = 'billing';
    const contactId = 'billingId';
    const contactMap = {};
    resolveDomain(contactMap);
    const contact = {
      contactId: contactId,
    };
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getEditExistingText(contactType)).toEqual('');
      expect(page.submitDisabled()).toBeTruthy();
    }).catch(err => fail(err));
  }));

  // error cases
  it('should have registrant error if the registrant contact resolved with an error', async(() => {
    const contactType = 'registrant';
    resolveDomain({
      'registrant': 'registrantId'
    });
    const errMsg = 'Bad ' + contactType + ' Contact';
    mockContactEppService.infoContact.and.returnValue(Promise.reject({code: '4555', 'message': errMsg}));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getContactErrorMsg(contactType)).toEqual(errMsg);
    }).catch(err => fail(err));
  }));

  it('should have admin error if the admin contact resolved with an error', async(() => {
    const contactType = 'admin';
    resolveDomain({
      'admin': 'adminId'
    });
    const errMsg = 'Bad ' + contactType + ' Contact';
    mockContactEppService.infoContact.and.returnValue(Promise.reject({code: '4555', 'message': errMsg}));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getContactErrorMsg(contactType)).toEqual(errMsg);
    }).catch(err => fail(err));
  }));

  it('should have tech error if the tech contact resolved with an error', async(() => {
    const contactType = 'tech';
    resolveDomain({
      'tech': 'techId'
    });
    const errMsg = 'Bad ' + contactType + ' Contact';
    mockContactEppService.infoContact.and.returnValue(Promise.reject({code: '4555', 'message': errMsg}));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getContactErrorMsg(contactType)).toEqual(errMsg);
    }).catch(err => fail(err));
  }));

  it('should have billing error if the billing contact resolved with an error', async(() => {
    const contactType = 'billing';
    resolveDomain({
      'billing': 'billingId'
    });
    const errMsg = 'Bad ' + contactType + ' Contact';
    mockContactEppService.infoContact.and.returnValue(Promise.reject({code: '4555', 'message': errMsg}));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getContactErrorMsg(contactType)).toEqual(errMsg);
    }).catch(err => fail(err));
  }));

  it('registrant editted validly should display and submit correctly', async(() => {
    const contactType = 'registrant';
    const contactId = 'registrantId';
    const newId = 'tmp' + contactId;
    const contactMap = {
      'registrant': contactId,
      'admin': contactId + 'admin',
      'tech': contactId + 'tech',
    };
    const contact = {
      contactId: contactId,
      postalInfo: [{
        name: 'Registrant Bobby',
        address: {
          city: 'Regellevue',
          countryCode: 'RE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    const eppMsg = {
      code: '1000',
      message: 'good'
    };
    const expUpdate = {
      changedElements: { registrant: newId }
    };
    resolveDomain(contactMap);
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(page.getContactInputText(contactType)).toEqual(contactId);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          page.setContactId(contactType, newId);
          fixture.detectChanges();
          expect(page.getContactInputText(contactType)).toEqual(newId);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(page.submitDisabled()).toBeFalsy();
            resolveDomainUpdate(eppMsg);
            page.clickSubmit();
            expect(mockDomainEppService.update).toHaveBeenCalledWith(component.domainDetail.fullyQualifiedDomainName, expUpdate);
          });
        });
      });
    }).catch(err => fail(err));
  }));

  it('admin editted validly should display and submit correctly', async(() => {
    const contactType = 'admin';
    const contactId = 'adminId';
    const newId = 'tmp' + contactId;
    const contactMap = {
      'registrant': contactId + 'registrant',
      'admin': contactId,
      'tech': contactId + 'tech',
    };
    const contact = {
      contactId: contactId,
      postalInfo: [{
        name: 'Admin Bobby',
        address: {
          city: 'Regellevue',
          countryCode: 'RE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    const eppMsg = {
      code: '1000',
      message: 'good'
    };
    const expUpdate = {
      addContacts: [{ type: contactType, value: newId }],
      remContacts: [{ type: contactType, value: contactId }]
    };
    resolveDomain(contactMap);
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(page.getContactInputText(contactType)).toEqual(contactId);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          page.setContactId(contactType, newId);
          fixture.detectChanges();
          expect(page.getContactInputText(contactType)).toEqual(newId);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(page.submitDisabled()).toBeFalsy();
            resolveDomainUpdate(eppMsg);
            page.clickSubmit();
            expect(mockDomainEppService.update).toHaveBeenCalledWith(component.domainDetail.fullyQualifiedDomainName, expUpdate);
          });
        });
      });
    }).catch(err => fail(err));
  }));


  it('tech editted validly should display and submit correctly', async(() => {
    const contactType = 'tech';
    const contactId = 'techId';
    const newId = 'tmp' + contactId;
    const contactMap = {
      'registrant': contactId + 'registrant',
      'admin': contactId + 'admin',
      'tech': contactId,
    };
    const contact = {
      contactId: contactId,
      postalInfo: [{
        name: 'tech Bobby',
        address: {
          city: 'Regellevue',
          countryCode: 'RE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    const eppMsg = {
      code: '1000',
      message: 'good'
    };
    const expUpdate = {
      addContacts: [{ type: contactType, value: newId }],
      remContacts: [{ type: contactType, value: contactId }]
    };
    resolveDomain(contactMap);
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(page.getContactInputText(contactType)).toEqual(contactId);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          page.setContactId(contactType, newId);
          fixture.detectChanges();
          expect(page.getContactInputText(contactType)).toEqual(newId);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(page.submitDisabled()).toBeFalsy();
            resolveDomainUpdate(eppMsg);
            page.clickSubmit();
            expect(mockDomainEppService.update).toHaveBeenCalledWith(component.domainDetail.fullyQualifiedDomainName, expUpdate);
          });
        });
      });
    }).catch(err => fail(err));
  }));

  it('billing editted validly should display and submit correctly', async(() => {
    const contactType = 'billing';
    const contactId = 'billingId';
    const newId = 'tmp' + contactId;
    const contactMap = {
      'registrant': contactId + 'registrant',
      'admin': contactId + 'admin',
      'tech': contactId + 'tech',
      'billing': contactId,
    };
    const contact = {
      contactId: contactId,
      postalInfo: [{
        name: 'billing Bobby',
        address: {
          city: 'Regellevue',
          countryCode: 'RE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    const eppMsg = {
      code: '1000',
      message: 'good'
    };
    const expUpdate = {
      addContacts: [{ type: contactType, value: newId }],
      remContacts: [{ type: contactType, value: contactId }]
    };
    resolveDomain(contactMap);
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(page.getContactInputText(contactType)).toEqual(contactId);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          page.setContactId(contactType, newId);
          fixture.detectChanges();
          expect(page.getContactInputText(contactType)).toEqual(newId);
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(page.submitDisabled()).toBeFalsy();
            resolveDomainUpdate(eppMsg);
            page.clickSubmit();
            expect(mockDomainEppService.update).toHaveBeenCalledWith(component.domainDetail.fullyQualifiedDomainName, expUpdate);
          });
        });
      });
    }).catch(err => fail(err));
  }));

it('billing added validly should display and submit correctly', async(() => {
    const contactType = 'billing';
    const contactId = 'billingId';
    const contactMap = {
      'registrant': contactId + 'registrant',
      'admin': contactId + 'admin',
      'tech': contactId + 'tech',
    };
    const contact = {
      contactId: contactId,
      postalInfo: [{
        name: 'billing Bobby',
        address: {
          city: 'Regellevue',
          countryCode: 'RE'
        },
      }
      ],
      voice: '8675309',
      fax: '48732984'
    };
    const eppMsg = {
      code: '1000',
      message: 'good'
    };
    const expUpdate = {
      addContacts: [{ type: contactType, value: contactId }],
    };
    resolveDomain(contactMap);
    resolveContact(contact);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(page.getContactInputText(contactType)).toEqual('');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
        page.setContactId(contactType, contactId);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
        expect(page.getContactInputText(contactType)).toEqual(contactId);
        fixture.detectChanges();
            expect(page.submitDisabled()).toBeFalsy();
            resolveDomainUpdate(eppMsg);
            page.clickSubmit();
            expect(mockDomainEppService.update).toHaveBeenCalledWith(component.domainDetail.fullyQualifiedDomainName, expUpdate);
          });
        });
      });
    }).catch(err => fail(err));
  }));
});

