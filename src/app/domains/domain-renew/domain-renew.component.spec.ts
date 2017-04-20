import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainRenewComponent } from './domain-renew.component';
import { DomainEppService } from '../../service/domain-epp.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocQuery } from '../../shared/testutils';

class DomainRenewPage {
  query: DocQuery<DomainRenewComponent>;

  constructor(private fixture: ComponentFixture<DomainRenewComponent>) {
    this.query = new DocQuery(fixture);
  }

  getHeaderDomainName(): string {
    const el = this.query.getElementByCss('#domainName');
    return el == null ? null : el.nativeElement.textContent.trim();
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('.alert-danger');
    return el == null ? null : el.nativeElement.textContent.trim();
  }

  clickSubmitButton() {
    const el = this.query.getElementByCss('#domainRenewSubmit');
    expect(el).not.toBeNull();
    el.nativeElement.click();
    this.fixture.detectChanges();
  }

  clickCancelButton() {
    const el = this.query.getElementByCss('#domainRenewClose');
    expect(el).not.toBeNull();
    el.nativeElement.click();
    this.fixture.detectChanges();
  }

  clickCloseButton() {
    const el = this.query.getElementByCss('#buttonCloseX');
    expect(el).not.toBeNull();
    el.nativeElement.click();
    this.fixture.detectChanges();
  }

  // TODO: get this to work correctly
  selectRenewalPeriod(value) {
    const el = this.query.getElementByCss('#renewalPeriod');
    expect(el).not.toBeNull();
    el.nativeElement.click();
    this.fixture.detectChanges();
    const sl = this.query.getElementByCss(`option[value = '${value}']`);
    expect(sl).not.toBeNull();
    sl.nativeElement.click();
    this.fixture.detectChanges();
  }
}

describe('DomainRenewComponent', () => {
  let component: DomainRenewComponent;
  let fixture: ComponentFixture<DomainRenewComponent>;
  let mockDomainService = {
    info: jasmine.createSpy('domainService.info'),
    renew: jasmine.createSpy('domainService.renew')
  };

  let mockRoute = {
    snapshot: {
      params: {
        'domainName': 'holy.cow',
      }
    }
  };
  let page: DomainRenewPage;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const domainDetail = {
    registrationExpirationTime: '2020-12-13T20:03:42Z'
  };

  function resolveDomain() {
    mockDomainService.info.and.returnValue(Promise.resolve(domainDetail));
    fixture.detectChanges();
    return fixture.whenStable();
  }

  function resolveDomainError(errorMessage) {
    mockDomainService.renew.and.returnValue(Promise.reject({ message: errorMessage }));
    fixture.detectChanges();
    return fixture.whenStable();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DomainRenewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainService },
        { provide: Router, useValue: mockRouter }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mockRoute = TestBed.get(ActivatedRoute);
    mockRouter = TestBed.get(Router);
    mockDomainService = TestBed.get(DomainEppService);
    mockDomainService.info.and.returnValue(Promise.resolve(domainDetail));
    fixture = TestBed.createComponent(DomainRenewComponent);
    page = new DomainRenewPage(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit to renew the default of 1 year', async(() => {
    resolveDomain().then(() => {
      fixture.detectChanges();
      mockDomainService.renew.and.returnValue(Promise.resolve());
      expect(page.getHeaderDomainName()).toBe('holy.cow');
      page.clickSubmitButton();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(mockDomainService.renew).toHaveBeenCalledWith('holy.cow', '2020-12-13', '1');
      });
    });
  }));

  it('should submit to renew the period selected', async(() => {
    resolveDomain().then(() => {
      fixture.detectChanges();
      mockDomainService.renew.and.returnValue(Promise.resolve());
      expect(page.getHeaderDomainName()).toBe('holy.cow');
      component.domainRenewForm.patchValue({ 'renewalPeriod': '2' });
      page.clickSubmitButton();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(mockDomainService.renew).toHaveBeenCalledWith('holy.cow', '2020-12-13', '2');
      });
    });
  }));

  it('should show submit error to user', async(() => {
    resolveDomainError('It done broke').then(() => {
      fixture.detectChanges();
      page.clickSubmitButton();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(page.getErrorMessage()).toBe('It done broke');
      });
    });
  }));

  it('should route back when canceled clicked', async(() => {
    page.clickCancelButton();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['../'], { relativeTo: mockRoute });
    });
  }));

  it('should route back when close button clicked', async(() => {
    page.clickCloseButton();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['../'], { relativeTo: mockRoute });
    });
  }));
});
