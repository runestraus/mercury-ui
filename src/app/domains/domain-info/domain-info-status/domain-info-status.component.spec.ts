import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipModule } from 'primeng/primeng';
import { DomainInfoStatusComponent } from './domain-info-status.component';
import { DomainDetail } from '../../../model/domain.model';
import { DocQuery } from '../../../shared/testutils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterOutletMap } from '@angular/router';
import { DomainEppService } from '../../../service/domain-epp.service';
import { RegistrarService } from '../../../service/registrar.service';
import { Registrar } from '../../../model/registrar.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { PermissionService } from '../../../service/permission.service';

class Page {
  query: DocQuery<DomainInfoStatusComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoStatusComponent>) {
    this.query = new DocQuery(fixture);
  }

  hasSmileyIcon() {
    return this.query.getElementByCss('#domainStatusIconOK') != null;
  }

  hasMehIcon() {
    return this.query.getElementByCss('#domainStatusIconInactive') != null;
  }

  isOperationIconDisabled(operationName: string): boolean {
    const el = this.query.getElementByCss(`#domainStatusIcon${operationName}`);
    expect(el).not.toBeNull();
    return el.classes['icon-disabled'];
  }

  clickDomainRenew() {
    const el = this.query.getElementByCss('#domainStatusIconRenew');
    expect(el).not.toBeNull();
    el.nativeElement.click();
  }

  clickDomainDelete() {
    const el = this.query.getElementByCss('#domainStatusIconDelete');
    expect(el).not.toBeNull();
    el.nativeElement.click();
  }

  clickDomainRestore() {
    const el = this.query.getElementByCss('#domainStatusIconRestore');
    expect(el).not.toBeNull();
    el.nativeElement.click();
  }

  getRegistrarName() {
    return this.query.getElementByCss('#domainRegistrar');
  }
}

let registrarService;
let router;
let route;
let permissionService;

let mockDomainEppService = {
  info: jasmine.createSpy('info'),
};

describe('DomainInfoStatusComponent', () => {
  let component: DomainInfoStatusComponent;
  let fixture: ComponentFixture<DomainInfoStatusComponent>;
  let page: Page;

  function getDomainData(statuses: Array<string>): DomainDetail {
    return {
      fullyQualifiedDomainName: 'holy.cow',
      status: statuses,
      currentSponsorClientId: 'brodaddy',
    } as DomainDetail;
  }

  function getRegistrar(): Registrar {
    return {
      registrarName: 'Donuts, Inc'
    } as Registrar;
  }

  beforeEach(async(() => {
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

    const mockPermissionService = {
      authorize: jasmine.createSpy('authorize')
    };

    const mockRegistrarService = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      declarations: [DomainInfoStatusComponent],
      providers: [
        RouterOutletMap,
        { provide: ActivatedRoute, useValue: route },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: RegistrarService, useValue: mockRegistrarService },
        { provide: PermissionService, useValue: mockPermissionService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [TooltipModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoStatusComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    mockDomainEppService = TestBed.get(DomainEppService);
    registrarService = TestBed.get(RegistrarService);
    permissionService = TestBed.get(PermissionService);
    permissionService.authorize.and.returnValue(Promise.reject({ authorized: true }));
    registrarService.get.and.returnValue(Promise.resolve(getRegistrar()));
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
  });

  it('should get a registrar name', () => {
    component.domain = getDomainData(['ok']);
    component.getRegistrar();
    component.registrar = getRegistrar();
    fixture.detectChanges();
    expect(page.getRegistrarName().nativeElement.innerText).toBe('Donuts, Inc');
  });

  it('should show a smiley icon for active domain', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(page.hasSmileyIcon()).toBeTruthy('Expected active smiley icon');
    expect(page.hasMehIcon()).toBeFalsy('Expected no inactive meh icon');
  });

  it('should show a meh icon for inactive domain', () => {
    component.domain = getDomainData(['inactive']);
    fixture.detectChanges();
    expect(page.hasMehIcon()).toBeTruthy('Expected active smiley icon');
    expect(page.hasSmileyIcon()).toBeFalsy('Expected no active smiley icon');
  });

  it('should show a normal domain transfer icon when transfer is not prohibited', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(page.isOperationIconDisabled('Transfer')).toBeFalsy();
  });

  it('should show a prohibited transfer icon when transfer is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientTransferProhibited']);
    fixture.detectChanges();
    expect(page.isOperationIconDisabled('Transfer')).toBeTruthy();
  });

  // TODO: test transfer click navigates to modal

  it('should show a normal domain renew icon when renew is not prohibited', async(() => {
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: true }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.isOperationIconDisabled('Renew')).toBeFalsy();
    }).catch(fail);
  }));

  it('should show a prohibited renew icon when renew is prohibited', async(() => {
    component.domain = getDomainData(['ok', 'clientRenewProhibited']);
    registrarService.get.and.returnValue(Promise.resolve(getRegistrar()));
    component.ngOnInit();
    fixture.detectChanges();
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: false, message: 'Not Authorized!' }));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickDomainRenew();
      fixture.detectChanges();
      expect(component.canRenew).toBeFalsy();
      expect(page.isOperationIconDisabled('Renew')).toBeTruthy();
      expect(router.navigate).not.toHaveBeenCalled();
    }).catch(fail);
  }));

  it('should navigate to domain renew when renew icon is clicked', async(() => {
    component.domain = getDomainData(['ok']);
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: true }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickDomainRenew();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['domainrenew'], { relativeTo: route });
      }).catch(fail);
    }).catch(fail);
  }));

  it('should show a normal domain restore icon when restore is not prohibited', async(() => {
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: true }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.isOperationIconDisabled('Restore')).toBeFalsy();
    }).catch(fail);
  }));

  it('should show a prohibited restore icon when restore is prohibited', async(() => {
    component.domain = getDomainData(['ok']);
    registrarService.get.and.returnValue(Promise.resolve(getRegistrar()));
    component.ngOnInit();
    fixture.detectChanges();
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: false, message: 'Not Authorized!' }));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickDomainRestore();
      fixture.detectChanges();
      expect(component.canRestore).toBeFalsy();
      expect(page.isOperationIconDisabled('Restore')).toBeTruthy();
      expect(router.navigate).not.toHaveBeenCalled();
    }).catch(fail);
  }));

  it('should navigate to domain restore when restore icon is clicked', async(() => {
    component.domain = getDomainData(['pendingDelete']);
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: true }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickDomainRestore();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['restore'], { relativeTo: route });
      }).catch(fail);
    }).catch(fail);
  }));

  it('should show a normal domain delete icon when delete is not prohibited', () => {
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: true }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.isOperationIconDisabled('Delete')).toBeFalsy();
    }).catch(fail);
  });

  it('should show a prohibited delete icon when delete is prohibited', async(() => {
    component.domain = getDomainData(['ok', 'clientDeleteProhibited']);
    registrarService.get.and.returnValue(Promise.resolve(getRegistrar()));
    component.ngOnInit();
    fixture.detectChanges();
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: false, message: 'Not Authorized!' }));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickDomainDelete();
      fixture.detectChanges();
      expect(component.canRenew).toBeFalsy();
      expect(page.isOperationIconDisabled('Delete')).toBeTruthy();
      expect(router.navigate).not.toHaveBeenCalled();
    }).catch(fail);
  }));

  it('should navigate to domain delete when delete icon is clicked', async(() => {
    component.domain = getDomainData(['ok']);
    permissionService.authorize.and.returnValue(Promise.resolve({ authorized: true }));
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickDomainDelete();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['domaindelete'], { relativeTo: route });
      }).catch(fail);
    }).catch(fail);
  }));

  it('should show a normal server status icon', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(page.isOperationIconDisabled('ServerStatus')).toBeFalsy();
  });

  it('should show a prohibited server status icon when server status update is prohibited', () => {
    component.domain = getDomainData(['ok', 'serverUpdateProhibited']);
    fixture.detectChanges();
    expect(page.isOperationIconDisabled('ServerStatus')).toBeTruthy();
  });
});
