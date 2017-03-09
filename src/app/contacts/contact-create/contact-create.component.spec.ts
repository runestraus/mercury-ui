import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCreateComponent } from './contact-create.component';
import { ContactEppService } from '../contactepp.service';
import { MeService } from '../../service/me.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { VALID, INVALID } from '@angular/forms/src/model';
import { AbstractMockObservableService } from '../../service/testing/abstract-mock-observable-service.test';
import { ActivatedRoute } from '@angular/router';
import { ContactDetail } from '../contact.model';

describe('ContactCreateComponent', () => {
  let component: ContactCreateComponent;
  let fixture: ComponentFixture<ContactCreateComponent>;
  const mockEppService = {
    createContact: jasmine.createSpy('eppService.createContact'),
    infoContact: jasmine.createSpy('eppService.infoContact'),
    updateContact: jasmine.createSpy('eppService.updateContact')
  };
  const mockMeService = {
    get: jasmine.createSpy('meService.get')
  };
  const mockRouter = {
    snapshot: {
      params: {}
    }
  };

  let meService;
  let eppService;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ContactCreateComponent],
      providers: [
        { provide: ContactEppService, useValue: mockEppService },
        { provide: MeService, useValue: mockMeService },
        { provide: ActivatedRoute, useValue: mockRouter },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
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
    beforeEach(() => {
      meService = TestBed.get(MeService);
      eppService = TestBed.get(ContactEppService);
      router = TestBed.get(ActivatedRoute);
      router.snapshot.params['contactId'] = '1234';
      meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
    });

    it('should get the contact from the eppService', () => {
      eppService.infoContact.and.returnValue(Promise.resolve({}));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(eppService.infoContact).toHaveBeenCalled();
    });

    it('should set the modal title to Edit Contact', () => {
      eppService.infoContact.and.returnValue(Promise.resolve({}));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.modalHeader).toBe('Edit Contact');
    });

    it('should update the form with info from contact received', async(() => {
      eppService.infoContact.and.returnValue(Promise.resolve(contact));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.contactForm.get('id').enable();
        const formData = component.contactForm.value;
        expect(eppService.infoContact).toHaveBeenCalledWith('1234');
        expect(component.modalHeader).toBe('Edit Contact');
        expect(component.isEditForm).toBeTruthy();
        expect(formData.id).toBe(contact.contactId);
        expect(formData.email).toBe(contact.email);
        expect(formData.name).toBe(contact.postalInfo[0].name);
        expect(formData.phone).toBe(contact.voice);
      });
    }));

    it('should submit an updated contact', async(() => {
      eppService.infoContact.and.returnValue(Promise.resolve(contact));
      eppService.updateContact.and.returnValue(Promise.resolve(contact));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.contactForm.patchValue({ name: 'Some new Name' });
        component.onSubmit();
        const contactCopy = { contactId: 'somecontactId',
          postalInfo: [{
            type: 'loc',
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
        contactCopy.postalInfo[0]['type'] = 'loc';
        expect(component.isEditForm).toBeTruthy();
        expect(eppService.updateContact).toHaveBeenCalledWith(contactCopy);
      });
    }));
  });

  describe('Create', () => {
    beforeEach(() => {
      meService = TestBed.get(MeService);
      eppService = TestBed.get(ContactEppService);
      meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
      fixture = TestBed.createComponent(ContactCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create a generated contactId that starts with the clientId', async(() => {
      fixture.whenStable().then(() => {
        component.contactForm.get('id').enable();
        expect(meService.get).toHaveBeenCalled();
        expect(component.contactForm.get('id').value).toContain('brodaddy');
      });
    }));

    it('should require email to be valid', async(() => {
      component.contactForm.patchValue({ name: 'ted', email: 'fakeemail' });
      component.contactForm.get('email').markAsDirty();
      component.onValueChanged();
      expect(component.contactForm.status).toBe(INVALID);
      expect(component.formErrors.email).toContain('Valid email address is required.');
    }));

    it('should require contactId, name, email, city, countrycode', () => {
      component.contactForm.get('id').enable();
      component.contactForm.patchValue({ id: '', name: '', email: '', city: '', countryCode: '' });
      component.contactForm.get('id').markAsDirty();
      component.contactForm.get('name').markAsDirty();
      component.contactForm.get('email').markAsDirty();
      component.contactForm.get('city').markAsDirty();
      component.contactForm.get('countryCode').markAsDirty();
      component.onValueChanged();
      expect(component.contactForm.status).toBe(INVALID);
      expect(component.formErrors.id).toBe('Contact id is required. ');
      expect(component.formErrors.name).toBe('Name is required. ');
      expect(component.formErrors.email).toBe('Email address is required. Valid email address is required. ');
      expect(component.formErrors.city).toBe('City is required. ');
      expect(component.formErrors.countryCode).toBe('Country code is required. ');
    });

    it('should submit the contact', () => {
      const user = {
        contactId: 'brodaddy-1234',
        postalInfo: [{
          type: 'loc',
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
      component.onSubmit();
      expect(eppService.createContact).toHaveBeenCalledWith(user);
    });
  });

});
