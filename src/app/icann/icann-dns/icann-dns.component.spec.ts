import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcannDnsComponent } from './icann-dns.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IcannService } from '../../service/icann.service';
import { HttpModule } from '@angular/http';
import { createMockRoute, DocQuery } from '../../shared/testutils';
import { Tld } from '../../model/tld.model';
import { ActivatedRoute, Router } from '@angular/router';
import {IcannDns} from '../../model/icannDns.counter.model';

class Page {
  query: DocQuery<IcannDnsComponent>;

  constructor(private fixture: ComponentFixture<IcannDnsComponent>) {
    this.query = new DocQuery(fixture);
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#errorMessage');
    return el ? el.nativeElement.textContent : null;
  }

  getTld(): string {
    const el = this.query.getElementByCss('#tld');
    return el ? el.nativeElement.textContent : null;
  }

  getTldValue(): string {
    const el = this.query.getElementByCss('#tld');
    return el ? el.nativeElement.value : null;
  }

  getNumberofOptionsForTld(): number {
    const el = this.query.getElementByCss('#tld');
    return el.nativeElement.options.length;
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

  getDnsReceivedCount(): string {
    const el = this.query.getElementByCss('#dnsReceivedCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getDnsRespondedCount(): string {
    const el = this.query.getElementByCss('#dnsRespondedCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getTcpReceivedCount(): string {
    const el = this.query.getElementByCss('#tcpReceivedCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getTcpRespondedCount(): string {
    const el = this.query.getElementByCss('#tcpRespondedCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  clickCancel() {
    this.query.getElementByCss('#cancelBtn').nativeElement.click();
  }
}

describe('IcannDnsComponent', () => {
  let component: IcannDnsComponent;
  let fixture: ComponentFixture<IcannDnsComponent>;
  let page: Page;
  let mockTld: Tld;
  let router;
  let route;

  let mockIcannService = {
    getIcannDns: jasmine.createSpy('getIcannDns'),
    submitIcannDns: jasmine.createSpy('submitIcannDns'),
    getAllTlds: jasmine.createSpy('getAllTlds')
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockRoute = createMockRoute(['/icann/icanndns']);

  function resolveTlds() {
    mockTld = new Tld;
    mockTld.name = 'name';
    mockIcannService.getAllTlds.and.returnValue(Promise.resolve([mockTld]));
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcannDnsComponent ],
      imports:      [ FormsModule, HttpModule, ],
      providers: [
        IcannService,
        { provide: IcannService, useValue: mockIcannService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcannDnsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    resolveTlds();
    component.allTlds = [{name: 'wtf'} as Tld, {name: 'cow'} as Tld];
    fixture.detectChanges();
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    mockIcannService = TestBed.get(IcannService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display seven input fields: tld, month, year, dnsUdpQueriesReceivedCount, dnsUdpQueriesRespondedCount, ' +
    'dnsTcpQueriesReceivedCount, dnsTcpQueriesRespondedCount', () => {
    expect(page.getTld()).toBe('wtfcow');
    expect(page.getNumberofOptionsForTld()).toBe(2);
    expect(page.getNumberofOptionForMonth()).toBe(13);
    expect(page.getNumberofOptionForYear(0)).toBe(10);
    expect(page.getDnsReceivedCount()).toBe('0');
    expect(page.getDnsRespondedCount()).toBe('0');
    expect(page.getTcpReceivedCount()).toBe('0');
    expect(page.getTcpRespondedCount()).toBe('0');
    expect(page.getErrorMessage()).toBe(null);
  });

  it('should submit form with data selected and get valid response back', () => {
    this.icannDns = new IcannDns();
    this.icannDns.tld = 'cow';
    this.icannDns.year = 2017;
    this.icannDns.month = 12;
    this.icannDns.dnsTcpQueriesReceivedCount = 3;
    this.icannDns.dnsTcpQueriesRespondedCount = 3;
    this.icannDns.dnsUdpQueriesRespondedCount = 3;
    this.icannDns.dnsUdpQueriesReceivedCount = 3;
    component.icannDns = this.icannDns;
    mockIcannService.submitIcannDns.and.returnValue(Promise.resolve(this.icannDns));
    component.submit();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(page.getTldValue()).toBe('cow');
        expect(page.getNumberofOptionsForTld()).toBe(2);
        expect(page.getNumberofOptionForMonth()).toBe(13);
        expect(page.getNumberofOptionForYear(0)).toBe(10);
        expect(page.getYear()).toBe('2017');
        expect(page.getMonth()).toBe('12');
        expect(page.getDnsReceivedCount()).toBe('3');
        expect(page.getDnsRespondedCount()).toBe('3');
        expect(page.getTcpReceivedCount()).toBe('3');
        expect(page.getTcpRespondedCount()).toBe('3');
        expect(page.getErrorMessage()).toBe(null);
      })
      .catch (err => {
        fail();
      });
  });

  it('should navigate back to parent component on cancel click', async(() => {
    this.icannDns = new IcannDns();
    this.icannDns.tld = 'cow';
    this.icannDns.year = 2017;
    this.icannDns.month = 12;
    this.icannDns.dnsTcpQueriesReceivedCount = 3;
    this.icannDns.dnsTcpQueriesRespondedCount = 3;
    this.icannDns.dnsUdpQueriesRespondedCount = 3;
    this.icannDns.dnsUdpQueriesReceivedCount = 3;
    fixture = TestBed.createComponent(IcannDnsComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    component.icannDns = this.icannDns;
    mockIcannService.submitIcannDns.and.returnValue(Promise.resolve(this.icannDns));
    component.submit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickCancel();
      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith(['../..'], {relativeTo: route});
      });
    });
  }));

  it('should get error from server', async(() => {
    this.icannDns = new IcannDns();
    this.icannDns.tld = 'cow';
    this.icannDns.year = 2017;
    this.icannDns.month = 12;
    this.icannDns.dnsTcpQueriesRespondedCount = 3;
    this.icannDns.dnsUdpQueriesRespondedCount = 3;
    this.icannDns.dnsUdpQueriesReceivedCount = 3;
    component.icannDns = this.icannDns;
    component = fixture.componentInstance;
    mockIcannService.submitIcannDns.and.returnValue(Promise.reject('ErrorMsg:Tcp Queries Received Count is required.'));
    component.submit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('Tcp Queries Received Count is required.');
    }).catch( err => {
      fail();
      }
    );
  }));
});
