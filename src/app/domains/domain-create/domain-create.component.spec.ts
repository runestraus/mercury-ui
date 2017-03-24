import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DomainCreateComponent } from './domain-create.component';
import { DomainEppService } from '../../service/domain-epp.service';
import { SessionService } from '../../service/session.service';
import { ContactEppService } from '../../contacts/contactepp.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('DomainCreateComponent', () => {
  let component: DomainCreateComponent;
  let fixture: ComponentFixture<DomainCreateComponent>;
  const mockDomainService = {
    create: jasmine.createSpy('domainService.create')
  };
  const mockSessionService = {
    tryGetCurrentUser: jasmine.createSpy('sessionService.tryGetCurrentUser')
  };
  const mockContactService = {
    checkContact: jasmine.createSpy('contactService.checkContact')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ DomainCreateComponent ],
      providers: [
        { provide: DomainEppService, useValue: mockDomainService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ContactEppService, useValue: mockContactService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockSessionService.tryGetCurrentUser.and.returnValue({
      user: {clientId: 'abc123'}
    });
    fixture = TestBed.createComponent(DomainCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should submit the new domain', () => {
    const domain = {
      clientId: 'abc123',
      fullyQualifiedDomainName: 'test.test',
      registrationPeriod: '1',
      domainNameserversArray: [],
      authInfo: '',
      contacts: [
        { type: 'admin', value: 'brodaddyAdmin' },
        { type: 'tech', value: 'brodaddyTech' },
        { type: 'billing', value: 'brodaddyBilling' }
      ],
      registrantContact: 'registrantContact'
    };
    mockDomainService.create.and.returnValue(Promise.resolve(domain));
    component.domainForm.patchValue({
      registrationPeriod: '1',
      registrantContact: domain.registrantContact,
      adminContact: 'brodaddyAdmin',
      techContact: 'brodaddyTech',
      billingContact: 'brodaddyBilling'
    });
    component.domainName = 'test.test';
    component.onSubmit();
    expect(mockDomainService.create).toHaveBeenCalledWith(domain);
  });

  it('should be invalid if the contact does not exist', fakeAsync(() => {
    mockContactService.checkContact.and.returnValue(Promise.resolve({
      avail: true
    }));
    component.domainForm.patchValue({
      registrantContact: 'contactThatDoesntExist'
    });
    component.domainForm.get('registrantContact').markAsDirty();
    component.onValueChanged();
    tick(500); // Wait for the debounce time
    expect(component.formErrors.registrantContact).toContain('Existing contact is required.');
  }));

  it('should require all contacts', () => {
    component.domainForm.get('registrantContact').markAsDirty();
    component.domainForm.get('adminContact').markAsDirty();
    component.domainForm.get('techContact').markAsDirty();
    component.domainForm.get('billingContact').markAsDirty();
    component.onValueChanged();
    expect(component.formErrors.registrantContact).toContain('Registrant Contact is required.');
    expect(component.formErrors.adminContact).toContain('Admin Contact is required.');
    expect(component.formErrors.billingContact).toContain('Billing Contact is required.');
    expect(component.formErrors.techContact).toContain('Tech Contact is required.');
  });
});
