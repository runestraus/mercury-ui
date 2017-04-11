import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DomainCreateComponent } from './domain-create.component';
import { DomainEppService } from '../../service/domain-epp.service';
import { SessionService } from '../../service/session.service';
import { ContactEppService } from '../../contacts/contactepp.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CanDirective } from '../../shared/directives/can.directive';
import { PermissionService } from '../../service/permission.service';
import { CanNotDirective } from '../../shared/directives/can-not.directive';
import { DocQuery } from '../../shared/testutils';

class Page {
  readonly PREMIUM_CONFIRMATION_ERROR = '#premiumConfirmationError';
  query: DocQuery<DomainCreateComponent>;
  constructor(private fixture: ComponentFixture<DomainCreateComponent>) {
    this.query = new DocQuery(fixture);
  }

  getFormError(id: string): string {
    const el = this.query.getElementByCss(id);
    expect(el).toBeTruthy();
    return el ? el.nativeElement.textContent : null;
  }
}

describe('DomainCreateComponent', () => {
  let component: DomainCreateComponent;
  let fixture: ComponentFixture<DomainCreateComponent>;
  let page: Page;
  let mockDomainService = {
    create: jasmine.createSpy('domainService.create'),
    check: jasmine.createSpy('domainService.check')
  };
  let mockSessionService = {
    getCurrentUser: jasmine.createSpy('sessionService.getCurrentUser')
  };
  const mockContactService = {
    checkContact: jasmine.createSpy('contactService.checkContact')
  };

  function resolveDomainCheck(isPremium: boolean) {
    mockDomainService.check.and.returnValue(Promise.resolve({
      domainPrices: {
        'create': {
          currency: 'USD',
          period: '1',
          periodUnit: '',
          feeClass: isPremium ? 'premium' : '',
          fee: {
            'create': '33.00'
          }
      }
    }}));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ DomainCreateComponent, CanDirective, CanNotDirective ],
      providers: [
        { provide: DomainEppService, useValue: mockDomainService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ContactEppService, useValue: mockContactService },
        PermissionService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockSessionService.getCurrentUser.and.returnValue(Promise.resolve({
      user: {
        clientId: 'abc123',
        permissions: ['EPP', 'SERVER_SIDE_STATUS', 'CRUD_EPP']
      }
    }));
    mockDomainService = TestBed.get(DomainEppService);
    mockSessionService = TestBed.get(SessionService);
    fixture = TestBed.createComponent(DomainCreateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should submit the new domain', async(() => {
    component.ngOnInit();
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
    fixture.detectChanges();
    fixture.whenStable().then(() => {
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
    }).catch(err => fail(err));

  }));

  it('should submit domain with premium prices if a premium name', async(() => {
    resolveDomainCheck(true);
    component.ngOnInit();
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
      registrantContact: 'registrantContact',
      premiumPrice: '33.00',
      premiumCurrency: 'USD'
    };
    fixture.detectChanges();
    fixture.whenStable().then(() => {
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
    }).catch(err => fail(err));

  }));

  it('should require all contacts', async(() => {
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.domainForm.get('registrantContact').markAsDirty();
      component.domainForm.get('adminContact').markAsDirty();
      component.domainForm.get('techContact').markAsDirty();
      component.domainForm.get('billingContact').markAsDirty();
      component.onValueChanged();
      expect(component.formErrors.registrantContact).toContain('Registrant Contact is required.');
      expect(component.formErrors.adminContact).toContain('Admin Contact is required.');
      expect(component.formErrors.billingContact).toContain('Billing Contact is required.');
      expect(component.formErrors.techContact).toContain('Tech Contact is required.');
      expect(component.formErrors.premiumConfirmation).toBe('');
    }).catch(err => fail(err));
  }));

  it('should require premium confirmation checkbox if premium name', async(() => {
    resolveDomainCheck(true);
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.domainForm.get('premiumConfirmation').markAsDirty();
        component.onValueChanged();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(page.getFormError(page.PREMIUM_CONFIRMATION_ERROR)).toContain('Confirmation of premium price is required.');
        });
      });
    }).catch(err => fail(err));
  }));

  it('should be invalid if the contact does not exist', fakeAsync(() => {
    component.ngOnInit();
    tick();
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
});
