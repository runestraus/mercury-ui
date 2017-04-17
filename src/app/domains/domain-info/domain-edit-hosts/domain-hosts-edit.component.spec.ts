import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DomainHostsEditComponent } from './domain-hosts-edit.component';
import { DomainDetail, DomainPrices } from '../../../model/domain.model';
import { DomainUpdateInfo } from '../../../epp/domainepp.template';
import { INVALID } from '@angular/forms/src/model';
import { DocQuery, createMockRoute } from '../../../shared/testutils';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainEppService } from '../../../service/domain-epp.service';

class Page {
  query: DocQuery<DomainHostsEditComponent>;

  constructor(private fixture: ComponentFixture<DomainHostsEditComponent>) {
    this.query = new DocQuery(fixture);
  }

  getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy('Element not found: ' + selector);
    return el;
  }

  clickCancel() {
    this.getElementByCss('#domainEditClose').nativeElement.click();
  }
}

describe('DomainHostsEditComponent', () => {
  let component: DomainHostsEditComponent;
  let fixture: ComponentFixture<DomainHostsEditComponent>;

  const mockEppService = {
    update: jasmine.createSpy('eppService.update'),
    info: jasmine.createSpy('eppService.info')
  };

  let mockRouter;
  let mockRoute;
  let eppService;
  let router;
  let route;

  beforeEach(async(() => {
    mockRoute = createMockRoute(['search/italys.pizza', 'domains/italys.pizza', 'hosts']);
    mockRoute.parent.snapshot = { params: { domainName: 'italys.pizza' } };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [DomainHostsEditComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DomainEppService, useValue: mockEppService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ],
    })
      .compileComponents();
  }));

  describe('Update', () => {
    let domain: DomainDetail;
    let domainPrices;
    let page: Page;

    beforeEach(() => {
      domainPrices = {
        'class': '',
        'prices': {
          'renew':
          {
            'currency': 'USD', 'fee':
            { 'renew': '66.00' }
          }
        }
      };

      domain = {
        fullyQualifiedDomainName: 'italys.pizza',
        status: ['INACTIVE'],
        repoId: '24B2882-pizza',
        currentSponsorClientId: 'tldsrus',
        creationClientId: 'tldsrus',
        creationTime: '2017-01-20T19:36:23Z',
        lastEppUpdateClientId: 'tldsrus',
        lastEppUpdateTime: '2017-02-01T20:55:51Z',
        lastTransferTime: '',
        registrationExpirationTime: '2018-01-20T19:36:23Z',
        authInfo: '',
        nameservers: ['ns1.italys.pizza', 'ns2.italys.pizza'],
        subordinateHosts: ['ns1.italys.pizza', 'ns2.italys.pizza'],
        contacts: { 'admin': 'Donuts', 'billing': 'Vegas', 'registrant': 'Donuts', 'tech': 'Donuts' },
        rgpStatus: '',
        domainPrices: domainPrices
      };

      eppService = TestBed.get(DomainEppService);
      router = TestBed.get(Router);
      route = TestBed.get(ActivatedRoute);
      route.snapshot.params['fullyQualifiedHostName'] = 'italys.pizza';
    });

    function rejectDomain(message: string) {
      eppService.update.and.returnValue(Promise.reject({
        code: '9999',
        message: message,
      }));
    }

    it('should create', () => {
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('should update the form with info from domain received', () => {
      eppService.info.and.returnValue(Promise.resolve(domain));
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const formData = component.domainHostsForm.value;
        expect(eppService.info).toHaveBeenCalledWith('italys.pizza');
        expect(component.domainHostsForm).toBeTruthy();
        expect(formData.fullyQualifiedDomainName).toBe(domain.fullyQualifiedDomainName);
        expect(formData.nameservers[0]).toBe(domain.nameservers[0]);
      }).catch(err => {
        fail('Err: ' + err);
      });
    });

    it('should submit an updated domain', async(() => {
      eppService.info.and.returnValue(Promise.resolve(domain));
      eppService.update.and.returnValue(Promise.resolve(domain));
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.domainName = 'italys.pizza';
        component.domainHostsForm.patchValue({ domainName: 'italys.pizza' });
        component.onSubmit();
        const DomainCopy = {
          fullyQualifiedDomainName: 'italys.pizza',
          status: ['INACTIVE'],
          repoId: '24B2882-pizza',
          currentSponsorClientId: 'tldsrus',
          creationClientId: 'tldsrus',
          creationTime: '2017-01-20T19:36:23Z',
          lastEppUpdateClientId: 'tldsrus',
          lastEppUpdateTime: '2017-02-01T20:55:51Z',
          lastTransferTime: '',
          registrationExpirationTime: '2018-01-20T19:36:23Z',
          authInfo: '',
          nameservers: ['ns1.italys.pizza', 'ns2.italys.pizza'],
          subordinateHosts: ['ns1.italys.pizza', 'ns2.italys.pizza'],
          contacts: { 'admin': 'Donuts', 'billing': 'Vegas', 'registrant': 'Donuts', 'tech': 'Donuts' },
          rgpStatus: '',
          domainPrices: domainPrices
        };
        const domainUpdateInfo: DomainUpdateInfo = {
          addHosts: [],
          remHosts: []
        };
        expect(eppService.update).toHaveBeenCalledWith('italys.pizza', domainUpdateInfo);
      }).catch(err => {
        fail('Err: ' + err);
      });
    }));

    it('should submit an updated domain with removed host', async(() => {
      eppService.info.and.returnValue(Promise.resolve(domain));
      eppService.update.and.returnValue(Promise.resolve(domain));
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.domainName = 'italys.pizza';
        component.removeNameserverInput(0);
        component.onSubmit();
        const remDomainHost: DomainUpdateInfo = {
          addHosts: [],
          remHosts: ['ns1.italys.pizza']
        };
        expect(eppService.update).toHaveBeenCalledWith('italys.pizza', remDomainHost);
      }).catch(err => {
        fail('Err: ' + err);
      });
    }));

    it('should submit an updated domain with added host', async(() => {
      eppService.info.and.returnValue(Promise.resolve(domain));
      eppService.update.and.returnValue(Promise.resolve(domain));
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.domainName = 'italys.pizza';
        component.addNameserverInput();
        component.domainHostsForm.patchValue({
          nameservers: [
            { nameserver: 'ns1.italys.pizza' }, { nameserver: 'ns2.italys.pizza' }, { nameserver: 'ns3.italys.pizza' }
          ]
        });
        const addDomainHost: DomainUpdateInfo = {
          addHosts: ['ns3.italys.pizza'],
          remHosts: []
        };
        component.onSubmit();
        expect(eppService.update).toHaveBeenCalledWith('italys.pizza', addDomainHost);
      }).catch(err => {
        fail('Err: ' + err);
      });
    }));

    it('should submit an updated domain with added and removed host', async(() => {
      eppService.info.and.returnValue(Promise.resolve(domain));
      eppService.update.and.returnValue(Promise.resolve(domain));
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.domainName = 'italys.pizza';
        component.addNameserverInput();
        component.domainHostsForm.patchValue({
          nameservers: [
            { nameserver: 'ns1.italys.pizza' }, { nameserver: 'ns2.italys.pizza' }, { nameserver: 'ns3.italys.pizza' }
          ]
        });
        component.removeNameserverInput(0);
        component.onSubmit();
        const domainHosts: DomainUpdateInfo = {
          addHosts: ['ns3.italys.pizza'],
          remHosts: ['ns1.italys.pizza']
        };
        expect(eppService.update).toHaveBeenCalledWith('italys.pizza', domainHosts);
      }).catch(err => {
        fail('Err: ' + err);
      });
    }));

    it('should navigate back to parent component on cancel click', async(() => {
      fixture = TestBed.createComponent(DomainHostsEditComponent);
      page = new Page(fixture);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        page.clickCancel();
        fixture.whenStable().then(() => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], { relativeTo: route });
        });
      }).catch(err => {
        fail('Err: ' + err);
      });
    }));
  });
});
