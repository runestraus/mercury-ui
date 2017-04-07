// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomainStatusComponent } from './domain-status.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomainEppService } from '../../service/domain-epp.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DomainDetail } from '../../model/domain.model';
import { DocQuery } from '../../shared/testutils';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { By } from '@angular/platform-browser';

class Page {
  fix: ComponentFixture<DomainStatusComponent>;
  elCheckBox: HTMLElement;

  domainDetail = {
  fullyQualifiedDomainName: 'dev.dev',
  status: ['ok'],
  repoId: 'FOO-123',
  currentSponsorClientId: 'RegistrarX',
  creationClientId: 'RegistrarX',
  creationTime: '2001-01-01T00:00:00Z',
  registrationExpirationTime: '2002-01-01T00:00:00Z',
  authInfo: '',
  nameservers: [],
  subordinateHosts: [],
  rgpStatus: '',
  domainPrices: null,
  contacts: {
    'tech': 'foo',
    'admin': 'foo',
    'registrant': 'bar',
  },
} as DomainDetail;
  query: DocQuery<DomainStatusComponent>;
  constructor(private fixture: ComponentFixture<DomainStatusComponent>) {
    this.query = new DocQuery(fixture);
    this.fix = fixture;
  }
  clickSubmit() {
    const el = this.query.getElementByCss('#domainStatusSubmit');
    el.nativeElement.click();
  }

  clickCheckBox(elementName) {
    this.elCheckBox = this.fix.debugElement.query(By.css(elementName)).nativeElement;
    expect(this.elCheckBox).toBeTruthy();
    this.elCheckBox.click();
  }
}

describe('DomainStatusComponent testing add all stati', () => {
  let component: DomainStatusComponent;
  let fixture: ComponentFixture<DomainStatusComponent>;
  let page: Page;
  let router;
  let route;

  const mockRoute = {
    url: Observable.create((observer: Observer<Array<string>>) => {
      observer.next(['serverstatus']);
      observer.complete();
    }),
    parent: {
      url: Observable.create((observer: Observer<Array<string>>) => {
        observer.next(['domains', 'dev.dev']);
        observer.complete();
      }),
      snapshot: {
        params: {
          'domainName': 'dev.dev',
        }
      },
      parent: {
        url: Observable.create((observer: Observer<Array<string>>) => {
          observer.next(['search', 'dev.dev']);
          observer.complete();
        })
      }
    },
  };

  const mockDomainEppService = {
    updateStatus: jasmine.createSpy('updateStatus'),
    info: jasmine.createSpy('info'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  function resolveDomain(statuses: Array<string>) {
    mockDomainEppService.info.and.returnValue(Promise.resolve({
      fullyQualifiedDomainName: 'dev.dev',
      status: statuses,
      repoId: 'FOO-123',
      currentSponsorClientId: 'RegistrarX',
      creationClientId: 'RegistrarX',
      creationTime: '2001-01-01T00:00:00Z',
      registrationExpirationTime: '2002-01-01T00:00:00Z',
      authInfo: '',
      nameservers: [],
      subordinateHosts: [],
      rgpStatus: '',
      domainPrices: null,
      contacts: {
        'tech': 'foo',
        'admin': 'foo',
        'registrant': 'bar',
      },
    }));
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainStatusComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ],
      imports: [
        ReactiveFormsModule, RouterModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainStatusComponent);
    router = TestBed.get(ActivatedRoute);
    route = TestBed.get(Router);
    component = fixture.componentInstance;
    resolveDomain(['ok']);
    page = new Page(fixture);
    component.domainDetail = page.domainDetail;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save a list of status to be added', async(() => {
    mockDomainEppService.updateStatus.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    fixture.detectChanges();
    component.domainDetail = page.domainDetail;
    page.clickCheckBox('#prohibited');
    page.clickCheckBox('#hold');
    page.clickCheckBox('#renew');
    page.clickCheckBox('#transfer');
    page.clickCheckBox('#update');
    page.clickCheckBox('#clientprohibited');
    page.clickCheckBox('#clienthold');
    page.clickCheckBox('#clientrenew');
    page.clickCheckBox('#clienttransfer');
    page.clickCheckBox('#clientupdate');
    page.clickSubmit();
    fixture.whenStable().then(() => {
      expect(mockDomainEppService.updateStatus).toHaveBeenCalledWith('dev.dev',
        [ 'serverDeleteProhibited',
          'serverHold',
          'serverRenewProhibited',
          'serverTransferProhibited',
          'serverUpdateProhibited',
          'clientDeleteProhibited',
          'clientHold',
          'clientRenewProhibited',
          'clientTransferProhibited',
          'clientUpdateProhibited' ],
        [ ]);
      expect(mockDomainEppService.updateStatus).toHaveBeenCalledTimes(1);
    });
  }));
});

describe('DomainStatusComponent remove status test', () => {
  let component: DomainStatusComponent;
  let fixture: ComponentFixture<DomainStatusComponent>;
  let page: Page;
  let router;
  let route;
  const mockRoute = {
    url: Observable.create((observer: Observer<Array<string>>) => {
      observer.next(['serverstatus']);
      observer.complete();
    }),
    parent: {
      url: Observable.create((observer: Observer<Array<string>>) => {
        observer.next(['domains', 'dev.dev']);
        observer.complete();
      }),
      snapshot: {
        params: {
          'domainName': 'dev.dev',
        }
      },
      parent: {
        url: Observable.create((observer: Observer<Array<string>>) => {
          observer.next(['search', 'dev.dev']);
          observer.complete();
        })
      }
    },
  };
  const mockDomainEppService = {
    updateStatus: jasmine.createSpy('updateStatus'),
    info: jasmine.createSpy('info'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  function resolveDomain(statuses: Array<string>) {
    mockDomainEppService.info.and.returnValue(Promise.resolve({
      fullyQualifiedDomainName: 'dev.dev',
      status: statuses,
      repoId: 'FOO-123',
      currentSponsorClientId: 'RegistrarX',
      creationClientId: 'RegistrarX',
      creationTime: '2001-01-01T00:00:00Z',
      registrationExpirationTime: '2002-01-01T00:00:00Z',
      authInfo: '',
      nameservers: [],
      subordinateHosts: [],
      rgpStatus: '',
      domainPrices: null,
      contacts: {
        'tech': 'foo',
        'admin': 'foo',
        'registrant': 'bar',
      },
    }));
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainStatusComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ],
      imports: [
        ReactiveFormsModule, RouterModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainStatusComponent);
    router = TestBed.get(ActivatedRoute);
    route = TestBed.get(Router);
    component = fixture.componentInstance;
    resolveDomain(['ok']);
    page = new Page(fixture);
    component.domainDetail = page.domainDetail;
    fixture.detectChanges();
  });

  it('should save a list of status to be removed', async(() => {
    mockDomainEppService.updateStatus.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    fixture.detectChanges();
    component.domainDetail = page.domainDetail;
    page.clickSubmit();
    fixture.whenStable().then(() => {
      expect(mockDomainEppService.updateStatus).toHaveBeenCalledWith('dev.dev',
        [  ],
        [ 'serverDeleteProhibited',
          'serverHold',
          'serverRenewProhibited',
          'serverTransferProhibited',
          'serverUpdateProhibited',
          'clientDeleteProhibited',
          'clientHold',
          'clientRenewProhibited',
          'clientTransferProhibited',
          'clientUpdateProhibited' ]);
      expect(mockDomainEppService.updateStatus).toHaveBeenCalledTimes(1);
    });
  }));
});
