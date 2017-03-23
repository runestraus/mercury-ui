import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HostCreateComponent } from './host-create.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HostEppService } from '../hostepp.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HostUpdateInfo, AddrInfo } from '../../epp/hostepp.template';
import { INVALID } from '@angular/forms/src/model';

describe('HostCreateComponent', () => {
  let component: HostCreateComponent;
  let fixture: ComponentFixture<HostCreateComponent>;

  const mockEppService = {
    createHost: jasmine.createSpy('eppService.createHost'),
    infoHost: jasmine.createSpy('eppService.infoHost'),
    updateHost: jasmine.createSpy('eppService.updateHost'),
  };

  const mockRouter = {
    snapshot: {
      params: {}
    }
  };

  const mockRoute = {
    navigate : jasmine.createSpy('navigate')
  };

  let eppService;
  let router;
  let route;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HostCreateComponent],
      providers: [
        { provide: HostEppService, useValue: mockEppService },
        { provide: ActivatedRoute, useValue: mockRouter },
        { provide: Router, useValue: mockRoute },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  describe('Update', () => {
    const host = {
      fullyQualifiedHostName: 'host.example.dev',
      repoId: 'brodaddy',
      status: '',
      inetAddresses: ['127.0.0.1'],
      currentSponsorClientId: 'brodaddy',
      creationClientId: 'brodaddy',
      creationTime: '',
      lastEppUpdateClientId: 'brodaddy',
      lastEppUpdateTime: '',
      lastTransferTime: '',
    };
    beforeEach(() => {
      eppService = TestBed.get(HostEppService);
      router = TestBed.get(ActivatedRoute);
      route = TestBed.get(Router);
      router.snapshot.params['fullyQualifiedHostName'] = 'host.example.dev';
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

      expect(component.modalHeader).toBe('Edit Host');
    });

    it('should update the form with info from host received', async(() => {
      eppService.infoHost.and.returnValue(Promise.resolve(host));
      fixture = TestBed.createComponent(HostCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        component.hostForm.get('fullyQualifiedHostName').enable();
        const formData = component.hostForm.value;
        expect(eppService.infoHost).toHaveBeenCalledWith('host.example.dev');
        expect(component.modalHeader).toBe('Edit Host');
        expect(component.isEditForm).toBeTruthy();
        expect(formData.fullyQualifiedHostName).toBe(host.fullyQualifiedHostName);
        expect(formData.inetAddresses[0]).toBe(host.inetAddresses[0]);
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
          addAddrs: hostAddAddr,
          remAddrs: undefined
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
        component.hostForm.patchValue({ fullyQualifiedHostName: 'host.example.dev' });
        component.addInetAddress();
        expect(component.isEditForm).toBeTruthy();
        expect(component.inetAddresses.length).toBe(2);
        component.removeInetAddress(1);
        expect(component.inetAddresses.length).toBe(1);
        component.addInetAddress();
        component.addInetAddress();
        expect(component.inetAddresses.length).toBe(3);
        component.removeInetAddress(2);
        component.removeInetAddress(1);
        expect(component.inetAddresses.length).toBe(1);
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

    it('should require fullyQualifiedHostName', () => {
      component.hostForm.get('fullyQualifiedHostName').enable();
      component.hostForm.get('inetAddresses').enable();
      component.hostForm.patchValue({ fullyQualifiedHostName: '', inetAddress: ['']});
      component.hostForm.get('fullyQualifiedHostName').markAsDirty();
      component.hostForm.get('inetAddresses').markAsDirty();
      component.onValueChanged();
      expect(component.hostForm.status).toBe(INVALID);
      expect(component.formErrors.fullyQualifiedHostName).toBe('Host name is required. ');
    });
  });
});
