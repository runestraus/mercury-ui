import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcannTldComponent } from './icann-tld.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { IcannService } from '../../service/icann.service';
import { HttpClient } from '../../shared/http.client';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {createMockRoute, DocQuery} from '../../shared/testutils';
import {Tld} from '../../model/tld.model';
import {ActivatedRoute, Router} from '@angular/router';
import {IcannTld} from '../../model/icannTld.counter.model';

class Page {
  query: DocQuery<IcannTldComponent>;

  constructor(private fixture: ComponentFixture<IcannTldComponent>) {
    this.query = new DocQuery(fixture);
  }

  getFormError(id: string): string {
    const el = this.query.getElementByCss(id);
    expect(el).toBeTruthy();
    return el ? el.nativeElement.textContent : null;
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#errorMessage');
    return el ? el.nativeElement.textContent : null;
  }

  getTld(): string {
    const el = this.query.getElementByCss('#tld');
    return el ? el.nativeElement.textContent : null;
  }

  getNumberofOptionsForTld(): number {
    const el = this.query.getElementByCss('#tld');
    return el.nativeElement.options.length;
  }

  getTldValue(): string {
    const el = this.query.getElementByCss('#tld');
    return el ? el.nativeElement.value : null;
  }

  getNumberofOptionForMonth(): number {
    const el = this.query.getElementByCss('#month');
    return el.nativeElement.options.length;
  }

  getMonth(): string {
    const el = this.query.getElementByCss('#month');
    return el.nativeElement.value;
  }

  getNumberofOptionForYear(row: number): number {
    const el = this.query.getElementByCss('#year');
    return el.nativeElement.options.length;
  }

  getYear(): string {
    const el = this.query.getElementByCss('#year');
    return el.nativeElement.value;
  }

  getClientId(): string {
    const el = this.query.getElementByCss('#clientId');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getWonCount(): string {
    const el = this.query.getElementByCss('#wonCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getLostCount(): string {
    const el = this.query.getElementByCss('#lostCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getNonDecisionCount(): string {
    const el = this.query.getElementByCss('#nonDecisionCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getReqCount(): string {
    const el = this.query.getElementByCss('#reqCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getGrantedCount(): string {
    const el = this.query.getElementByCss('#grantedCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getDomainsCount(): string {
    const el = this.query.getElementByCss('#domainsCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  clickCancel() {
    this.query.getElementByCss('#cancelBtn').nativeElement.click();
  }
}

describe('IcannTldComponent', () => {
  let component: IcannTldComponent;
  let fixture: ComponentFixture<IcannTldComponent>;
  const meService = null;
  let page: Page;
  let router;
  let route;
  let mockTld: Tld;
  const mockArrayTld: Tld[] = [];

  const mockMeService = {
    get: jasmine.createSpy('meService.get')
  };

  const mockIcannService = {
    getIcannTld: jasmine.createSpy('getIcannTld'),
    submitIcannTld: jasmine.createSpy('submitIcannTld'),
    getAllTlds: jasmine.createSpy('getAllTlds')
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockRoute = createMockRoute(['/icann/icanndns']);

  function resolveTlds() {
    mockTld = new Tld;
    mockTld.name = 'name';
    mockTld.state = 'PREDELEGATION';
    mockArrayTld.push(mockTld);
    mockIcannService.getAllTlds.and.returnValue(Promise.resolve(mockArrayTld));
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcannTldComponent ],
      imports:      [ FormsModule, HttpModule, CalendarModule, NoopAnimationsModule ],
      providers: [
        IcannService, HttpClient,
        { provide: IcannService, useValue: mockIcannService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcannTldComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    page = new Page(fixture);
    resolveTlds();
    component.allTlds = [{name: 'wtf'} as Tld, {name: 'cow'} as Tld];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display ten fields: tld, month, year, clientId, wonCount, lostCount, ' +
    'nonDecisionCount, reqCount, grantedCount, domainsCount', () => {
    expect(page.getTld()).toBe('wtfcow');
    expect(page.getNumberofOptionsForTld()).toBe(2);
    expect(page.getNumberofOptionForMonth()).toBe(13);
    expect(page.getNumberofOptionForYear(0)).toBe(10);
    expect(page.getClientId()).toBe('');
    expect(page.getWonCount()).toBe('0');
    expect(page.getLostCount()).toBe('0');
    expect(page.getNonDecisionCount()).toBe('0');
    expect(page.getReqCount()).toBe('0');
    expect(page.getGrantedCount()).toBe('0');
    expect(page.getDomainsCount()).toBe('0');
    expect(page.getErrorMessage()).toBe(null);
  });

  it('should submit form with data selected and get valid response back', () => {
    this.icannTld = new IcannTld();
    this.icannTld.tld = 'cow';
    this.icannTld.clientId = '9999';
    this.icannTld.year = 2017;
    this.icannTld.month = 12;
    this.icannTld.agpExemptedDomainsCount = 3;
    this.icannTld.agpExemptionRequestsCount = 3;
    this.icannTld.agpExemptionsGrantedCount = 3;
    this.icannTld.transferDisputedLostCount = 3;
    this.icannTld.transferDisputedNondecisionCount = 3;
    this.icannTld.transferDisputedWonCount = 3;
    component.icannTld = this.icannTld;
    mockIcannService.submitIcannTld.and.returnValue(Promise.resolve(this.icannTld));
    component.submit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(page.getTldValue()).toBe('cow');
      expect(page.getClientId()).toBe('9999');
      expect(page.getNumberofOptionsForTld()).toBe(2);
      expect(page.getNumberofOptionForMonth()).toBe(13);
      expect(page.getNumberofOptionForYear(0)).toBe(10);
      expect(page.getYear()).toBe('2017');
      expect(page.getMonth()).toBe('12');
      expect(page.getDomainsCount()).toBe('3');
      expect(page.getGrantedCount()).toBe('3');
      expect(page.getReqCount()).toBe('3');
      expect(page.getNonDecisionCount()).toBe('3');
      expect(page.getLostCount()).toBe('3');
      expect(page.getWonCount()).toBe('3');
      expect(page.getErrorMessage()).toBe(null);
    })
      .catch (err => {
        fail();
      });
  });

  it('should navigate back to parent component on cancel click', async(() => {
    this.icannTld = new IcannTld();
    this.icannTld.tld = 'cow';
    this.icannTld.clientId = '9999';
    this.icannTld.year = 2017;
    this.icannTld.month = 12;
    this.icannTld.agpExemptedDomainsCount = 3;
    this.icannTld.agpExemptionRequestsCount = 3;
    this.icannTld.agpExemptionsGrantedCount = 3;
    this.icannTld.transferDisputedLostCount = 3;
    this.icannTld.transferDisputedNondecisionCount = 3;
    this.icannTld.transferDisputedWonCount = 3;
    component.icannTld = this.icannTld;
    mockIcannService.submitIcannTld.and.returnValue(Promise.resolve(this.icannTld));
    fixture = TestBed.createComponent(IcannTldComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCancel();
      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith(['../..'], {relativeTo: route});
      });
    });
  }));
});
