import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcannRegistrarComponent } from './icann-registrar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { IcannService } from '../../service/icann.service';
import { HttpClient } from '../../shared/http.client';
import { MeService } from '../../service/me.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {createMockRoute, DocQuery} from '../../shared/testutils';
import {Tld} from '../../model/tld.model';
import {ActivatedRoute, Router} from '@angular/router';
import {IcannRegistrar} from '../../model/icannRegistrar.counter.model';

class Page {
  query: DocQuery<IcannRegistrarComponent>;

  constructor(private fixture: ComponentFixture<IcannRegistrarComponent>) {
    this.query = new DocQuery(fixture);
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#errorMessage');
    return el ? el.nativeElement.value : null;
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

  clickTld(): string {
    const el = this.query.getElementByCss('#tld');
    el.nativeElement.click();
    return el ? el.nativeElement.textContent : null;
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

  getRampUpCount(): string {
    const el = this.query.getElementByCss('#rampUpCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getPreRampUpCount(): string {
    const el = this.query.getElementByCss('#preRampUpCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  getZfaPasswordsCount(): string {
    const el = this.query.getElementByCss('#zfaPasswordsCount');
    return el.nativeElement.getAttributeNode('ng-reflect-model').value;
  }

  clickCancel() {
    this.query.getElementByCss('#cancelBtn').nativeElement.click();
  }
}

describe('IcannRegistrarComponent', () => {
  let component: IcannRegistrarComponent;
  let fixture: ComponentFixture<IcannRegistrarComponent>;
  let meService;
  let page: Page;
  let router;
  let route;
  let mockTld: Tld;
  const mockArrayTld: Tld[] = [];

  const mockMeService = {
    get: jasmine.createSpy('meService.get')
  };

  const mockIcannService = {
    submitIcannRegistrar: jasmine.createSpy('submitIcannRegistrar'),
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
      declarations: [ IcannRegistrarComponent ],
      imports:      [ FormsModule, HttpModule, CalendarModule, NoopAnimationsModule ],
      providers: [
        IcannService, HttpClient,
        { provide: IcannService, useValue: mockIcannService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MeService, useValue: mockMeService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    meService = TestBed.get(MeService);
    meService.get.and.returnValue(Promise.resolve({ clientId: 'brodaddy' }));
    fixture = TestBed.createComponent(IcannRegistrarComponent);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    page = new Page(fixture);
    resolveTlds();
    component.allTlds = [{name: 'wtf'} as Tld, {name: 'cow'} as Tld];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form has six fields, tld, month, year, rampUpCount, preRampUpCount, zfaPasswordsCount', () => {
    expect(page.getTld()).toBe('wtfcow');
    expect(page.getTldValue()).toBe('wtf');
    expect(page.getNumberofOptionsForTld()).toBe(2);
    expect(page.getNumberofOptionForMonth()).toBe(13);
    expect(page.getNumberofOptionForYear(0)).toBe(10);
    expect(page.getRampUpCount()).toBe('0');
    expect(page.getPreRampUpCount()).toBe('0');
    expect(page.getZfaPasswordsCount()).toBe('0');
    expect(page.getErrorMessage()).toBe(null);
  });

  it('should submit form with data selected and get valid response back', () => {
    this.icannRegistrar = new IcannRegistrar();
    this.icannRegistrar.tld = 'cow';
    this.icannRegistrar.year = 2017;
    this.icannRegistrar.month = 12;
    this.icannRegistrar.preRampUpRegistrarsCount = 3;
    this.icannRegistrar.rampUpRegistrarsCount = 3;
    this.icannRegistrar.zfaPasswordsCount = 3;
    component.icannRegistrar = this.icannRegistrar;
    mockIcannService.submitIcannRegistrar.and.returnValue(Promise.resolve(this.icannRegistrar));
    component.submit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(page.getTldValue()).toBe('cow');
      expect(page.getNumberofOptionsForTld()).toBe(2);
      expect(page.getNumberofOptionForMonth()).toBe(13);
      expect(page.getNumberofOptionForYear(0)).toBe(10);
      expect(page.getYear()).toBe('2017');
      expect(page.getMonth()).toBe('12');
      expect(page.getRampUpCount()).toBe('3');
      expect(page.getPreRampUpCount()).toBe('3');
      expect(page.getZfaPasswordsCount()).toBe('3');
      expect(page.getErrorMessage()).toBe(null);
    })
    .catch (err => {
      fail();
    });
  });

  it('should navigate back to parent component on cancel click', async(() => {
    this.icannRegistrar = new IcannRegistrar();
    this.icannRegistrar.tld = 'cow';
    this.icannRegistrar.year = 2017;
    this.icannRegistrar.month = 12;
    this.icannRegistrar.preRampUpRegistrarsCount = 3;
    this.icannRegistrar.rampUpRegistrarsCount = 3;
    this.icannRegistrar.zfaPasswordsCount = 3;
    component.icannRegistrar = this.icannRegistrar;
    mockIcannService.submitIcannRegistrar.and.returnValue(Promise.resolve(this.icannRegistrar));
    fixture = TestBed.createComponent(IcannRegistrarComponent);
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
