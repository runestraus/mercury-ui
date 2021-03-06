import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule, RouterOutletMap } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DomainEppService } from '../../service/domain-epp.service';
import { DomainInfoComponent } from './domain-info.component';
import { DocQuery } from '../../shared/testutils';
import { DomainLabelsService } from '../../service/domain.lables.service';
import { HttpClient } from '../../shared/http.client';
import { HttpModule } from '@angular/http';

class Page {
  query: DocQuery<DomainInfoComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoComponent>) {
    this.query = new DocQuery(fixture);
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#domainInfoError');
    return el ? el.nativeElement.textContent : null;
  }

  isLoading(): boolean {
    return this.query.getElementByCss('#domainInfoLoading') != null;
  }

  hasInfoIcon(): boolean {
    return this.query.getElementByCss('#domainInfoIcon') != null;
  }

  getDomainExpiration(): string {
    const el = this.query.getElementByCss('.domainExpirationHeader');
    return el ? el.nativeElement.textContent : null;
  }

  getPremiumInformation(): string {
    const el = this.query.getElementByCss('#premiumDomainInfo');
    return el ? el.nativeElement.textContent : null;
  }

  hasDomainLabels(i: number): boolean {
    return this.query.getElementByCss('#domain-lable-' + i) != null;
  }

  clickCloseButton(): void {
    this.query.getElementByCss('#domainInfoClose').nativeElement.click();
  }

  clickHeaderX(): void {
    this.query.getElementByCss('#buttonCloseX').nativeElement.click();
  }
}

describe('DomainInfoComponent', () => {
  let component: DomainInfoComponent;
  let fixture: ComponentFixture<DomainInfoComponent>;
  let page: Page;

  const mockDomainEppService = {
    info: jasmine.createSpy('info'),
    isPremium: jasmine.createSpy('isPremium')
  };

  const mockDomainLabelService = {
    getDomainLabels: jasmine.createSpy('getDomainLabels'),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockRoute = {
    snapshot: {
      params: {
        'domainName': 'holy.cow',
      }
    },
    parent: {
      url: Observable.create((observer: Observer<Array<string>>) => {
        observer.next(['search', 'holy.cow']);
        observer.complete();
      })
    }
  };

  function resolveDomain(statuses: Array<string>) {
    mockDomainEppService.info.and.returnValue(Promise.resolve({
      fullyQualifiedDomainName: 'holy.cow',
      status: statuses,
      currentSponsorClientId: 'brodaddy',
      registrationExpirationTime: '2010-01-01T00:00:00Z',
    }));
  }
  function resolveNotBlockedDomain() {
    mockDomainLabelService.getDomainLabels.and.returnValue(Promise.resolve({
      labels: null,
      price: {
        value: 33.00,
        currency: 'USD'
      }
    }));
  }

  function resolveDomainLabels() {
    mockDomainLabelService.getDomainLabels.and.returnValue(Promise.resolve({
      labels: ['RSV', 'PREMIUM'],
      price: {
        value: 33.00,
        currency: 'USD'
      }
    }));
  }
  function resolveBlockedDomain() {
    mockDomainLabelService.getDomainLabels.and.returnValue(Promise.resolve({
      labels: ['Blocked'],
      price: {
        value: 55.00,
        currency: 'USD'
      }
    }));
  }
  function rejectDomainCreate(message: string) {
    mockDomainEppService.info.and.returnValue(Promise.reject({
      code: '2303',
      message: message,
    }));
  }
  function resolvePremiumDomain() {
    mockDomainEppService.info.and.returnValue(Promise.resolve({
      fullyQualifiedDomainName: 'holy.cow',
      status: ['ok'],
      currentSponsorClientId: 'brodaddy',
      registrationExpirationTime: '2010-01-01T00:00:00Z',
      domainPrices: {
        prices: {
          'renew': {
            currency: 'USD',
            period: '1',
            periodUnit: '',
            feeClass: 'premium',
            fee: {
              'renew': '33.00'
            }
          }
        }
      }
    }));
  }

  function rejectDomain(message: string) {
    mockDomainEppService.info.and.returnValue(Promise.reject({
      code: '9999',
      message: message,
    }));
  }
  function verifyNoErrorMessage() {
    expect(page.getErrorMessage()).toBeFalsy('Expected no error message');
  }

  beforeEach(() => {
    // Return the promise immediately and resolve later
    TestBed.configureTestingModule({
      declarations: [ DomainInfoComponent ],
      providers: [
        RouterOutletMap, HttpClient,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter },
        { provide: DomainLabelsService, useValue: mockDomainLabelService}
      ],
      imports: [
        RouterModule, HttpModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should be in an initial loading state', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(page.isLoading()).toBeTruthy('Page should be loading');
      expect(page.getDomainExpiration()).toBeFalsy('Expected no expiration in header');
      expect(page.hasInfoIcon()).toBeFalsy('Expected no info icon');
    });

  }));

  it('should not be in loading state after service promise resolves', async(() => {
    resolveDomain(['ok']);
    resolveNotBlockedDomain();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.isLoading()).toBeFalsy('Expected no loading div');
      verifyNoErrorMessage();
    });
  }));

  it('should not be in loading state after service promise resolves', async(() => {
    resolveDomain(['ok']);
    resolveBlockedDomain();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.isLoading()).toBeFalsy('Expected no loading div');
      expect(page.hasBlockedIcon).toBeTruthy('Expected Blocked Icon');
      expect(page.getPremiumInformation()).toBe('$55.00');
    });
  }));

  it('should show domain expiration and info icon in header after service promise resolves', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getDomainExpiration()).toBeDefined(); // No longer checking value because of timezone changes
      expect(page.hasInfoIcon()).toBeTruthy('Expected info icon');
    });
  }));

  it('should show premium domain info in header after name', async(() => {
    mockDomainEppService.isPremium.and.returnValue(true);
    resolvePremiumDomain();
    resolveDomainLabels();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getPremiumInformation()).toBe('$33.00');
      expect(page.hasDomainLabels(0)).toBeTruthy('Expected Domain Label');
      expect(page.hasDomainLabels(1)).toBeTruthy('Expected Domain Label');
      expect(page.hasDomainLabels(2)).toBeFalsy('Only expected two Domain Labels.');
    });
  }));

  it('should navigate back to search when close is clicked', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCloseButton();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['../..'], {relativeTo: mockRoute});
      });
    });
  }));

  it('should navigate back to search when header X is clicked', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickHeaderX();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['../..'], {relativeTo: mockRoute});
      });
    });
  }));

  it('should show an error message after service promise rejects', async(() => {
    rejectDomain('You broke it!');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('You broke it!');
    });
  }));

  it('should navigate to domain info details component', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#domainInfoIcon').click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['details'], {relativeTo: mockRoute});
      });
    });
  }));
});
