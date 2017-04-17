import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HostCreateComponent } from './host-create.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HostEppService } from '../hostepp.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { HostUpdateInfo, AddrInfo } from '../../epp/hostepp.template';
import { HostDetail } from '../host.model';
import { DocQuery, createMockRoute } from '../../shared/testutils';

class Page {
  query: DocQuery<HostCreateComponent>;

  constructor(private fixture: ComponentFixture<HostCreateComponent>) {
    this.query = new DocQuery(fixture);
  }

  getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy('Element not found: ' + selector);
    return el;
  }

  clickCancel() {
    this.getElementByCss('#host-create-cancel').nativeElement.click();
  }
}

describe('HostCreateComponent', () => {
  let component: HostCreateComponent;
  let fixture: ComponentFixture<HostCreateComponent>;

  const mockEppService = {
    createHost: jasmine.createSpy('eppService.createHost'),
    infoHost: jasmine.createSpy('eppService.infoHost'),
    updateHost: jasmine.createSpy('eppService.updateHost'),
  };

  let mockRouter;

  let mockRoute;

  let eppService;
  let router;
  let route;

  beforeEach(async(() => {
    mockRoute = createMockRoute(['search/host.example.dev', 'hosts/host.example.dev']);

    mockRouter = {
      navigate : jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HostCreateComponent],
      providers: [
        { provide: HostEppService, useValue: mockEppService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  describe('Update', () => {
    let host: HostDetail;
    let page: Page;

    beforeEach(() => {
      host = {
        fullyQualifiedHostName: 'host.example.dev',
        repoId: 'brodaddy',
        status: [''],
        inetAddresses: ['127.0.0.1'],
        currentSponsorClientId: 'brodaddy',
        creationClientId: 'brodaddy',
        creationTime: '',
        lastEppUpdateClientId: 'brodaddy',
        lastEppUpdateTime: '',
        lastTransferTime: '',
      };
      eppService = TestBed.get(HostEppService);
      router = TestBed.get(Router);
      route = TestBed.get(ActivatedRoute);
      route.snapshot.params['fullyQualifiedHostName'] = 'host.example.dev';
    });

    it('should create', () => {
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('should get the host from the eppService', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(eppService.infoHost).toHaveBeenCalledWith('host.example.dev');
    }));

    it('should set the modal title to Edit Host', () => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.modalHeader).toBe('Host: host.example.dev');
    });

    it('should update the form with info from host received', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const formData = component.hostForm.value;
        expect(eppService.infoHost).toHaveBeenCalledWith('host.example.dev');
        expect(component.modalHeader).toBe('Host: host.example.dev');
        expect(component.isEditForm).toBeTruthy();
        expect(formData.inetAddresses[0].inetAddress).toBe(host.inetAddresses[0]);
      });
    }));

    it('should update the form with info from a host with no addresses', async(() => {
      host.inetAddresses = [];
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const formData = component.hostForm.value;
        expect(eppService.infoHost).toHaveBeenCalledWith('host.example.dev');
        expect(component.modalHeader).toBe('Host: host.example.dev');
        expect(component.isEditForm).toBeTruthy();
        expect(formData.inetAddresses).toEqual([ ]);
      });
    }));

    it('should submit an updated host', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      eppService.updateHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.hostForm.patchValue({ fullyQualifiedHostName: 'host.example.dev' });
        component.onSubmit();
        const HostCopy = {
          fullyQualifiedHostName: 'host.example.dev',
          repoId: 'brodaddy',
          status: '',
          inetAddresses: ['127.0.0.1'],
          currentSponsorClientId: 'brodaddy',
          creationClientId: 'brodaddy',
          creationTime: '',
          lastEppUpdateClientId: 'brodaddy',
          lastEppUpdateTime: '',
          lastTransferTime: ''
        };
        const hostAddAddr: AddrInfo[] = HostCopy.inetAddresses.map(address => {
          return {
            value: address
          } as AddrInfo;
        });
        const hostUpdateInfo: HostUpdateInfo = {
          addAddrs: [],
          remAddrs: []
        };
        expect(component.isEditForm).toBeTruthy();
        expect(eppService.updateHost).toHaveBeenCalledWith('host.example.dev', hostUpdateInfo);
      });
    }));

    it('should submit an updated host with no ip addresses', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      eppService.updateHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.removeInetAddress(0);
        component.onSubmit();
        const hostRemAddr: AddrInfo[] = [{
          value: '127.0.0.1'
        } as AddrInfo];
        const hostUpdateInfo: HostUpdateInfo = {
          addAddrs: [],
          remAddrs: hostRemAddr,
        };
        expect(component.isEditForm).toBeTruthy();
        expect(eppService.updateHost).toHaveBeenCalledWith('host.example.dev', hostUpdateInfo);
      });
    }));

    it('should test add and remove of InetAddress', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      eppService.updateHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.addInetAddress();
        expect(component.isEditForm).toBeTruthy();
        expect(component.hostForm.value.inetAddresses.length).toEqual(2);
        component.removeInetAddress(1);
        expect(component.hostForm.value.inetAddresses.length).toEqual(1);
        component.removeInetAddress(0);
        expect(component.hostForm.value.inetAddresses.length).toEqual(0);
        component.addInetAddress();
        expect(component.hostForm.value.inetAddresses.length).toEqual(1);
      });
    }));

    it('should navigate back to parent component on cancel click', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      eppService.updateHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
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

  describe('Create', () => {
    beforeEach(() => {
      eppService = TestBed.get(HostEppService);
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should require IP Address', () => {
      component.hostForm.get('inetAddresses').enable();
      component.hostForm.patchValue({ inetAddress: ['']});
      component.hostForm.get('inetAddresses').markAsDirty();
      component.onValueChanged();
      expect(component.hostForm.status).toBe('INVALID');
    });
  });
});
