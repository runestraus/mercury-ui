import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactCreateComponent } from './contact-create.component';
import { ContactEppService } from '../contactepp.service';
import { MeService } from '../../service/me.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { createMockRoute, DocQuery } from '../../shared/testutils';

class Page {
  query: DocQuery<ContactCreateComponent>;

  constructor(private fixture: ComponentFixture<ContactCreateComponent>) {
    this.query = new DocQuery(fixture);
  }

  getNewContactIdInput() {
    const el = this.query.getElementByCss('#newContactId');
    return el ? el.nativeElement.value : null;
  }

  isContactIdDisabled(): boolean {
    const el = this.query.getElementByCss('#newContactId');
    return el.nativeElement.disabled;
  }

  clickCustomizeContactId() {
    const el = this.query.getElementByCss('#customizeContactIDButton');
    expect(el).not.toBeNull();
    el.nativeElement.click();
  }

  getEmailError() {
    const el = this.query.getElementByCss('#email-error');
    return el ? el.nativeElement.textContent : null;
  }

  getContactIdError() {
    const el = this.query.getElementByCss('#contact-id-error');
    return el ? el.nativeElement.textContent : null;
  }

  getNameError() {
    const el = this.query.getElementByCss('#name-error');
    return el ? el.nativeElement.textContent : null;
  }

  getCityError() {
    const el = this.query.getElementByCss('#city-error');
    return el ? el.nativeElement.textContent : null;
  }

  getCountryCodeError() {
    const el = this.query.getElementByCss('#country-code-error');
    return el ? el.nativeElement.textContent : null;
  }

  isSubmitDisabled(): boolean {
    const el = this.query.getElementByCss('#contact-create-submit-button');
    expect(el).not.toBeNull();
    return el.nativeElement.disabled;
  }

  clickSubmitButton() {
    const el = this.query.getElementByCss('#contact-create-submit-button');
    expect(el).not.toBeNull();
    el.nativeElement.click();
  }

  getEmailValue() {
    const el = this.query.getElementByCss('#contact-email');
    return el ? el.nativeElement.value : null;
  }

  getPhoneValue() {
    const el = this.query.getElementByCss('#contact-phone');
    return el ? el.nativeElement.value : null;
  }

  getNameValue() {
    const el = this.query.getElementByCss('#contact-name');
    return el ? el.nativeElement.value : null;
  }

  clickCancel() {
    this.query.getElementByCss('#contact-create-cancel-button').nativeElement.click();
  }

  clickHeaderX() {
    this.query.getElementByCss('#buttonCloseX').nativeElement.click();
  }
}

describe('ContactCreateComponent', () => {
  let component: ContactCreateComponent;
  let fixture: ComponentFixture<ContactCreateComponent>;
  let location;
  let meService;
  let eppService;
  let router;
  let page: Page;

  beforeEach(async(() => {
    const mockLocationService = {
      back: jasmine.createSpy('back')
    };
    const mockEppService = {
      createContact: jasmine.createSpy('eppService.createContact'),
      infoContact: jasmine.createSpy('eppService.infoContact'),
      updateContact: jasmine.createSpy('eppService.updateContact')
    };
    const mockMeService = {
      get: jasmine.createSpy('meService.get')
    };
    const mockRoute = createMockRoute(['search/holy.cow', 'domains/holy.cow/contacts/edit/1234'], {params: Object({contactId: '1234'})});
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ContactCreateComponent],
      providers: [
        { provide: ContactEppService, useValue: mockEppService },
        { provide: MeService, useValue: mockMeService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Location, useValue: mockLocationService },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('Update', () => {
    const contact = {
      contactId: 'somecontactId',
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
    const contactId = '1234';
    beforeEach(() => {
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;

      meService = TestBed.get(MeService);
      eppService = TestBed.get(ContactEppService);
      router = TestBed.get(ActivatedRoute);
      location = TestBed.get(Location);
      router.snapshot.params['contactId'] = contactId;
      meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
      page = new Page(fixture);
    });

    it('should get the contact from the eppService', () => {
      eppService.infoContact.and.returnValue(Promise.resolve({}));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(eppService.infoContact).toHaveBeenCalled();
    });

    it('should set the modal title to Edit Contact: contactId', () => {
      eppService.infoContact.and.returnValue(Promise.resolve({}));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.modalHeader).toBe(`Edit Contact: ${contactId}`);
    });

    it('should update the form with info from contact received', async(() => {
      eppService.infoContact.and.returnValue(Promise.resolve(contact));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.contactForm.get('id').enable();
        const formData = component.contactForm.value;
        expect(eppService.infoContact).toHaveBeenCalledWith('1234');
        expect(component.modalHeader).toBe(`Edit Contact: ${contactId}`);
        expect(component.isEditForm).toBeTruthy();
        expect(formData.id).toBe(contact.contactId);
        expect(page.getEmailValue()).toBe(contact.email);
        expect(page.getNameValue()).toBe(contact.postalInfo[0].name);
        expect(page.getPhoneValue()).toBe(contact.voice);
      }).catch(fail);
    }));

    it('should submit an updated contact', async(() => {
      eppService.infoContact.and.returnValue(Promise.resolve(contact));
      eppService.updateContact.and.returnValue(Promise.resolve(contact));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.contactForm.patchValue({ name: 'Some new Name' });
        expect(page.isSubmitDisabled()).toBeFalsy();
        component.onSubmit();
        const contactCopy = { contactId: 'somecontactId',
          postalInfo: [{
            type: 'int',
            name: 'Some new Name',
            street1: '123 Main St',
            street2: '',
            street3: '',
            city: 'Bellevue',
            state: 'WA',
            zip: '98002',
            countryCode: 'US'
          }],
          email: 'something@donuts.email',
          voice: '8675309',
          fax: '48732984'
        };
        contactCopy.postalInfo[0].name = 'Some new Name';
        contactCopy.postalInfo[0]['type'] = 'int';
        expect(component.isEditForm).toBeTruthy();
        expect(eppService.updateContact).toHaveBeenCalledWith(contactCopy);
      }).catch(fail);
    }));
  });

  describe('Create', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      meService = TestBed.get(MeService);
      eppService = TestBed.get(ContactEppService);
      location = TestBed.get(Location);
      page = new Page(fixture);
      meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
      fixture.detectChanges();
    });

    it('should show the generated contactId', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(page.getNewContactIdInput()).toContain('brodaddy');
      }).catch(fail);
    }));

    it('should disable contactId until customizeContactId is clicked', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(page.isSubmitDisabled()).toBeTruthy();
        page.clickCustomizeContactId();
        fixture.detectChanges();
        expect(page.isSubmitDisabled()).toBeFalsy();
      }).catch(fail);
    });

    it('should create a generated contactId that starts with the clientId', async(() => {
      fixture.whenStable().then(() => {
        component.contactForm.get('id').enable();
        expect(meService.get).toHaveBeenCalled();
        expect(component.contactForm.get('id').value).toContain('brodaddy');
      }).catch(fail);
    }));

    it('should require email to be valid', async(() => {
      component.contactForm.patchValue({ name: 'ted', email: 'fakeemail' });
      component.contactForm.get('email').markAsDirty();
      component.onValueChanged();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(page.isSubmitDisabled()).toBeTruthy();
        expect(page.getEmailError()).toContain('Valid email address is required.');
      }).catch(fail);
    }));

    it('should require contactId, name, email, city, countrycode', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.contactForm.get('id').enable();
        component.contactForm.patchValue({ id: '', name: '', email: '', city: '', countryCode: '' }, { emitEvent: true });
        component.contactForm.get('id').markAsDirty();
        component.contactForm.get('name').markAsDirty();
        component.contactForm.get('email').markAsDirty();
        component.contactForm.get('city').markAsDirty();
        component.contactForm.get('countryCode').markAsDirty();
        component.onValueChanged();
        fixture.detectChanges();
        expect(page.getContactIdError()).toBe('Contact id is required. ');
        expect(page.getNameError()).toContain('Name is required. ');
        expect(page.getEmailError()).toBe('Email address is required. Valid email address is required. ');
        expect(page.getCityError()).toBe('City is required. ');
        expect(page.getCountryCodeError()).toBe('Country code is required. ');
        expect(page.isSubmitDisabled()).toBeTruthy();
      }).catch(fail);
    }));

    it('should submit the contact', async(() => {
      const user = {
        contactId: 'brodaddy-1234',
        postalInfo: [{
          type: 'int',
          name: 'Ricky Bobby',
          street1: '',
          street2: '',
          street3: '',
          city: 'Bellevue',
          state: '',
          zip: '',
          countryCode: 'US'
        }],
        email: 'fake@email.email',
        voice: '',
        fax: ''
      };
      eppService.createContact.and.returnValue(Promise.resolve(user));
      component.contactForm.patchValue({
        id: 'brodaddy-1234',
        name: 'Ricky Bobby',
        email: 'fake@email.email',
        city: 'Bellevue',
        countryCode: 'US'
      });
      fixture.detectChanges();
      expect(page.isSubmitDisabled()).toBeFalsy();
      page.clickSubmitButton();
      expect(eppService.createContact).toHaveBeenCalledWith(user);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(location.back).toHaveBeenCalled();
      }).catch(fail);
    }));
  });

  it('should navigate back when X is clicked in the header', async(() => {
    meService = TestBed.get(MeService);
    meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
    eppService = TestBed.get(ContactEppService);
    fixture = TestBed.createComponent(ContactCreateComponent);
    page = new Page(fixture);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      page.clickHeaderX();
      fixture.whenStable().then(() => {
        expect(location.back).toHaveBeenCalled();
      }).catch(fail);
    }).catch(fail);
  }));

  it('should navigate back when Cancel is clicked in the header', async(() => {
    meService = TestBed.get(MeService);
    meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
    eppService = TestBed.get(ContactEppService);
    fixture = TestBed.createComponent(ContactCreateComponent);
    page = new Page(fixture);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      page.clickCancel();
      fixture.whenStable().then(() => {
        expect(location.back).toHaveBeenCalled();
      }).catch(fail);
    }).catch(fail);
  }));
});
