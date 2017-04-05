import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { DomainEppService } from '../../service/domain-epp.service';
import { DomainDetail, DomainPrices, DomainPrice } from '../../model/domain.model';
import { DomainInfoDetailComponent } from './domain-info-detail.component';
import { DocQuery } from '../../shared/testutils';

class Page {
  query: DocQuery<DomainInfoDetailComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoDetailComponent>) {
    this.query = new DocQuery(fixture);
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#domainInfoError');
    return el ? el.nativeElement.textContent : null;
  }

  isLoading(): boolean {
    return this.query.getElementByCss('#domainInfoLoading') != null;
  }

  getDomainInfoDetail(): string {
    const el = this.query.getElementByCss('#domainInfoDetail');
    return el ? el.nativeElement.textContent : null;
  }
  getDomainInfoDetailFullyQualifiedDomainName(): string {
    const el = this.query.getElementByCss('#domainInfoDetailFullyQualifiedDomainName');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailRepoId(): string {
    const el = this.query.getElementByCss('#domainInfoDetailRepoId');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailStatus(i: number): string {
    const el = this.query.getElementByCss('#domainInfoDetailStatus' + i);
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailRegistrantContact(): string {
    const el = this.query.getElementByCss('#domainInfoDetailRegistrantContact');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailAdminContact(): string {
    const el = this.query.getElementByCss('#domainInfoDetailAdminContact');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailTechContact(): string {
    const el = this.query.getElementByCss('#domainInfoDetailTechContact');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailBillingContact(): string {
    const el = this.query.getElementByCss('#domainInfoDetailBillingContact');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailNameserver(i: number): string {
    const el = this.query.getElementByCss('#domainInfoDetailNameserver' + i);
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailSubordinateHost(i: number): string {
    const el = this.query.getElementByCss('#domainInfoDetailSubordinateHost' + i);
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailClientId(): string {
    const el = this.query.getElementByCss('#domainInfoDetailClientId');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailCreatedBy(): string {
    const el = this.query.getElementByCss('#domainInfoDetailCreatedBy');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailCreatedDate(): string {
    const el = this.query.getElementByCss('#domainInfoDetailCreatedDate');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailUpdatedBy(): string {
    const el = this.query.getElementByCss('#domainInfoDetailUpdatedBy');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailUpdatedDate(): string {
    const el = this.query.getElementByCss('#domainInfoDetailUpdatedDate');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailExpirationDate(): string {
    const el = this.query.getElementByCss('#domainInfoDetailExpirationDate');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailTransferTime(): string {
    const el = this.query.getElementByCss('#domainInfoDetailTransferTime');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailAuthInfo(): string {
    const el = this.query.getElementByCss('#domainInfoDetailAuthInfo');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailPriceClass(): string {
    const el = this.query.getElementByCss('#domainInfoDetailPriceClass');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailPriceCreate(): string {
    const el = this.query.getElementByCss('#domainInfoDetailPriceCreate');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailPriceRenew(): string {
    const el = this.query.getElementByCss('#domainInfoDetailPriceRenew');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailPriceRestore(): string {
    const el = this.query.getElementByCss('#domainInfoDetailPriceRestore');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailPriceTransfer(): string {
    const el = this.query.getElementByCss('#domainInfoDetailPriceTransfer');
    return el ? el.nativeElement.textContent : null;
  }

  getDomainInfoDetailClose(): string {
    const el = this.query.getElementByCss('#domainInfoDetailClose');
    return el ? el.nativeElement.textContent : null;
  }

  clickHeaderX(): void {
    this.query.getElementByCss('#buttonCloseX').nativeElement.click();
  }

  clickClose(): void {
    this.query.getElementByCss('#domainInfoDetailClose').nativeElement.click();
  }
}

describe('DomainInfoDetailComponent', () => {
  let component: DomainInfoDetailComponent;
  let fixture: ComponentFixture<DomainInfoDetailComponent>;
  let page: Page;
  let details: DomainDetail;
  function newDomainDetail(): DomainDetail {
    const domainDetail: DomainDetail = new DomainDetail();
    domainDetail.fullyQualifiedDomainName = 'cow.cow';
    domainDetail.status = ['ok'];
    domainDetail.repoId = 'repoId';
    domainDetail.currentSponsorClientId = 'currentSponsorClientId';
    domainDetail.creationClientId = 'currentClientId';
    domainDetail.creationTime = 'march 3rd, 2018';
    domainDetail.lastEppUpdateClientId = 'string';
    domainDetail.lastEppUpdateTime = 'string';
    domainDetail.lastTransferTime = 'string';
    domainDetail.registrationExpirationTime = 'march 3rd, 2018';
    domainDetail.authInfo = 'authInfo';
    domainDetail.nameservers = ['ns1', 'ns2', 'ns3'];
    domainDetail.subordinateHosts = ['sh1', 'sh2', 'sh3'];
    domainDetail.contacts = {
      'billing': 'billingGuy',
      'registrant': 'registrantGuy',
      'tech': 'techGuy',
      'admin': 'adminGuy',
    };
    domainDetail.rgpStatus = 'rpgStatusStat';
    domainDetail.domainPrices = {
      class: 'class',
      prices: {
        'renew': {
          currency: 'USD',
          period: '1',
          periodUnit: 'year',
          fee: {
            'renew': '9.99',
          },
        },
        'restore': {
          currency: 'USD',
          period: '1',
          periodUnit: 'year',
          fee: {
            'restore': '7.01',
          },
        },
        'transfer': {
          currency: 'USD',
          period: '1',
          periodUnit: 'year',
          fee: {
            'transfer': '15.67',
            'processing': '33.67',
          },
        },
        'create': {
          currency: 'USD',
          period: '1',
          periodUnit: 'year',
          fee: {
            'create': '27.00',
          },
        },
      },
    };
    return domainDetail;
  }

  function checkPrices() {
      expect(page.getDomainInfoDetailPriceCreate()).toEqual('$' + details.domainPrices.prices['create'].fee['create']);
      expect(page.getDomainInfoDetailPriceRenew()).toEqual('$' + details.domainPrices.prices['renew'].fee['renew']);
      expect(page.getDomainInfoDetailPriceRestore()).toEqual('$' + details.domainPrices.prices['restore'].fee['restore']);
      expect(page.getDomainInfoDetailPriceTransfer()).toEqual('$' + details.domainPrices.prices['transfer'].fee['transfer']);
      expect(page.getDomainInfoDetailPriceClass()).toEqual(details.domainPrices.class);
  }

  function checkEditProperties() {
    expect(page.getDomainInfoDetailUpdatedDate()).toEqual(details.lastEppUpdateTime);
    expect(page.getDomainInfoDetailUpdatedBy()).toEqual(details.lastEppUpdateClientId);
    expect(page.getDomainInfoDetailTransferTime()).toEqual(details.lastTransferTime);
    expect(page.getDomainInfoDetailAuthInfo()).toEqual(details.authInfo);
  }

  function checkContacts() {
    expect(page.getDomainInfoDetailRegistrantContact()).toEqual(details.contacts['registrant']);
    expect(page.getDomainInfoDetailAdminContact()).toEqual(details.contacts['admin']);
    expect(page.getDomainInfoDetailTechContact()).toEqual(details.contacts['tech']);
    expect(page.getDomainInfoDetailBillingContact()).toEqual(details.contacts['billing']);
  }

  function checkStaticProps() {
    expect(page.getDomainInfoDetailCreatedDate()).toEqual(details.creationTime);
    expect(page.getDomainInfoDetailCreatedBy()).toEqual(details.creationClientId);
    expect(page.getDomainInfoDetailExpirationDate()).toEqual(details.registrationExpirationTime);
    expect(page.getDomainInfoDetailClientId()).toEqual(details.currentSponsorClientId);
    expect(page.getDomainInfoDetailFullyQualifiedDomainName()).toEqual(details.fullyQualifiedDomainName);
    expect(page.getDomainInfoDetailRepoId()).toEqual(details.repoId);
  }

  function checkNameservers() {
    for (let i = 0; i < details.nameservers.length; i++ ) {
      expect(page.getDomainInfoDetailNameserver(i)).toEqual(details.nameservers[i]);
    }
  }

  function checkStatus() {
    for (let i = 0; i < details.status.length; i++ ) {
      expect(page.getDomainInfoDetailStatus(i)).toEqual(details.status[i]);
    }
  }

  function checkSubordinateHosts() {
    for (let i = 0; i < details.subordinateHosts.length; i++ ) {
      expect(page.getDomainInfoDetailSubordinateHost(i)).toEqual(details.subordinateHosts[i]);
    }
  }

  const mockDomainEppService = {
    info: jasmine.createSpy('info'),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockRoute = {
    url: Observable.create((observer: Observer<Array<string>>) => {
      observer.next(['details']);
      observer.complete();
    }),
    snapshot: {
      params: {
        'domainName': 'holy.cow',
      }
    },
    parent: {
      url: Observable.create((observer: Observer<Array<string>>) => {
        observer.next(['domains', 'holy.cow']);
        observer.complete();
      }),

      parent: {
        url: Observable.create((observer: Observer<Array<string>>) => {
          observer.next(['search', 'holy.cow']);
          observer.complete();
        })
      }
    },
  };

  function resolveDomain(domainDetail: DomainDetail) {
    mockDomainEppService.info.and.returnValue(Promise.resolve(
      domainDetail
    ));
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
      declarations: [DomainInfoDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoDetailComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    details = newDomainDetail();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    verifyNoErrorMessage();
  });

  it('should be in an initial loading state', async(() => {
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      verifyNoErrorMessage();
      expect(page.isLoading()).toBeTruthy('Page should be loading');
    });
  }));

  it('should not be in loading state after service promise resolves', async(() => {
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => { expect(page.isLoading()).toBeFalsy('Expected no loading div'); });
    });
  }));

  it('close should navigate back to search on domain info modal', async(() => {
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickClose();
      fixture.detectChanges();
      fixture.whenStable().then(() => { expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], {relativeTo: mockRoute}); });
    });
  }));

  it('x should navigate back to search on domain info modal', async(() => {
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickHeaderX();
      fixture.detectChanges();
      fixture.whenStable().then(() => { expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], {relativeTo: mockRoute}); });
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

  // test properly displaying all values
  it('should display proper values for past update', async(() => {
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkEditProperties();
      checkContacts();
      checkPrices();
      checkSubordinateHosts();
      checkStatus();
      checkNameservers();
      checkStaticProps();
    });
  }));

  // test conditional displaying values
  it('should not display create or restore prices', async(() => {
    details.domainPrices.prices['create'] = null;
    details.domainPrices.prices['restore'] = null;
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkStaticProps();
      expect(page.getDomainInfoDetailPriceCreate()).toEqual(null);
      expect(page.getDomainInfoDetailPriceRenew()).toEqual('$' + details.domainPrices.prices['renew'].fee['renew']);
      expect(page.getDomainInfoDetailPriceRestore()).toEqual(null);
      expect(page.getDomainInfoDetailPriceTransfer()).toEqual('$' + details.domainPrices.prices['transfer'].fee['transfer']);
      expect(page.getDomainInfoDetailPriceClass()).toEqual(details.domainPrices.class);
    });
  }));

  it('should not display any prices because no domainPrices object', async(() => {
    details.domainPrices = null;
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkStaticProps();
      expect(page.getDomainInfoDetailPriceCreate()).toEqual(null);
      expect(page.getDomainInfoDetailPriceRenew()).toEqual(null);
      expect(page.getDomainInfoDetailPriceRestore()).toEqual(null);
      expect(page.getDomainInfoDetailPriceTransfer()).toEqual(null);
      expect(page.getDomainInfoDetailPriceClass()).toEqual(null);
    });
  }));

  it('should not display renew or transfer prices or class', async(() => {
    details.domainPrices.prices['renew'] = null;
    details.domainPrices.prices['transfer'] = null;
    details.domainPrices.class = null;
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkStaticProps();
      expect(page.getDomainInfoDetailPriceCreate()).toEqual('$' + details.domainPrices.prices['create'].fee['create']);
      expect(page.getDomainInfoDetailPriceRenew()).toEqual(null);
      expect(page.getDomainInfoDetailPriceRestore()).toEqual('$' + details.domainPrices.prices['restore'].fee['restore']);
      expect(page.getDomainInfoDetailPriceTransfer()).toEqual(null);
      expect(page.getDomainInfoDetailPriceClass()).toEqual(null);
    });
  }));

  it('should not display nameservers, status, or subordinateHosts', async(() => {
    details.nameservers = [];
    details.status = [];
    details.subordinateHosts = [];
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkStaticProps();
      expect(page.getDomainInfoDetailSubordinateHost(0)).toEqual(null);
      expect(page.getDomainInfoDetailNameserver(0)).toEqual(null);
      expect(page.getDomainInfoDetailStatus(0)).toEqual(null);
    });
  }));

  it('should not display authInfo, lastEppUpdateTime, lastEppUpdateClientId, or lastTransferTime', async(() => {
    details.authInfo = null;
    details.lastEppUpdateTime = null;
    details.lastEppUpdateClientId = null;
    details.lastTransferTime = null;
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkStaticProps();
      expect(page.getDomainInfoDetailTransferTime()).toEqual(null);
      expect(page.getDomainInfoDetailUpdatedDate()).toEqual(null);
      expect(page.getDomainInfoDetailUpdatedBy()).toEqual(null);
      expect(page.getDomainInfoDetailAuthInfo()).toEqual(null);
    });
  }));

  it('should not display registrant, or billing', async(() => {
    details.contacts['billing'] = null;
    details.contacts['registrant'] = null;
    resolveDomain(details);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      checkStaticProps();
      expect(page.getDomainInfoDetailAdminContact()).toEqual(details.contacts['admin']);
      expect(page.getDomainInfoDetailTechContact()).toEqual(details.contacts['tech']);
      expect(page.getDomainInfoDetailBillingContact()).toEqual(null);
      expect(page.getDomainInfoDetailRegistrantContact()).toEqual(null);
    });
  }));
});
