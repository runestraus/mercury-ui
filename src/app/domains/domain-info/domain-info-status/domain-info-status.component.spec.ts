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

  getOperationIconSize(operationName: string): string {
    const el = this.query.getElementByCss(`#domainStatusIcon${operationName}`);
    if (!el) {
      return null;
    }
    if (el.classes['fa-2x']) {
      return 'normal';
    } else if (el.classes['fa-stack-1x']) {
      return 'small';
    }
    return 'unknown';
  }

  isOperationProhibited(operationName: string): boolean {
    return this.query.getElementByCss(`#domainStatusIcon${operationName}Prohibited`) != null;
  }

  getRegistrarName() {
    return this.query.getElementByCss('#domainRegistrar');
  }
}

const mockDomainEppService = {
  info: jasmine.createSpy('info'),
};

let mockRegistrarService = {
  get: jasmine.createSpy('get')
};

const registrar: Registrar = new Registrar();

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
    TestBed.configureTestingModule({
      declarations: [ DomainInfoStatusComponent ],
      providers: [
        RouterOutletMap,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: RegistrarService, useValue: mockRegistrarService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [ TooltipModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoStatusComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    mockRegistrarService = TestBed.get(RegistrarService);
    mockRegistrarService.get.and.returnValue(Promise.resolve(getRegistrar()));
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
    expect(page.getOperationIconSize('Transfer')).toBe('normal');
    expect(page.isOperationProhibited('Transfer')).toBeFalsy();
  });

  it('should show a prohibited transfer icon when transfer is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientTransferProhibited']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('Transfer')).toBe('small');
    expect(page.isOperationProhibited('Transfer')).toBeTruthy();
  });

  // TODO: test transfer click navigates to modal

  it('should show a normal domain renew icon when renew is not prohibited', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('Renew')).toBe('normal');
    expect(page.isOperationProhibited('Renew')).toBeFalsy();
  });

  it('should show a prohibited renew icon when renew is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientRenewProhibited']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('Renew')).toBe('small');
    expect(page.isOperationProhibited('Renew')).toBeTruthy();
  });

  // TODO: test renew click navigates to modal

  // TODO: test restore click navigates to modal

  it('should show a normal domain delete icon when delete is not prohibited', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('Delete')).toBe('normal');
    expect(page.isOperationProhibited('Delete')).toBeFalsy();
  });

  it('should show a prohibited delete icon when delete is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientDeleteProhibited']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('Delete')).toBe('small');
    expect(page.isOperationProhibited('Delete')).toBeTruthy();
  });

  it('should show a normal server status icon', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('ServerStatus')).toBe('normal');
    expect(page.isOperationProhibited('ServerStatus')).toBeFalsy();
  });

  it('should show a prohibited server status icon when server status update is prohibited', () => {
    component.domain = getDomainData(['ok', 'serverUpdateProhibited']);
    fixture.detectChanges();
    expect(page.getOperationIconSize('ServerStatus')).toBe('small');
    expect(page.isOperationProhibited('ServerStatus')).toBeTruthy();
  });
});
