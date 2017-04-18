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
import { createMockRoute, DocQuery } from '../../shared/testutils';
import { By } from '@angular/platform-browser';

class Page {
  fix: ComponentFixture<DomainStatusComponent>;
  query: DocQuery<DomainStatusComponent>;
  constructor(private fixture: ComponentFixture<DomainStatusComponent>) {
    this.query = new DocQuery(fixture);
    this.fix = fixture;
  }
  clickSubmit() {
    const el = this.query.getElementByCss('#domainStatusSubmit');
    expect(el).toBeTruthy();
    el.nativeElement.click();
  }

  clickCheckBox(elementName) {
    const elCheckBox = this.fix.debugElement.query(By.css(elementName));
    expect(elCheckBox).toBeTruthy();
    elCheckBox.nativeElement.click();
  }
}

describe('A DomainStatusComponent', () => {
  let component: DomainStatusComponent;
  let fixture: ComponentFixture<DomainStatusComponent>;
  let page: Page;
  let router;
  let route;
  let domainEppService;

  function resolveDomain(statuses: Array<string>) {
    domainEppService.info.and.returnValue(Promise.resolve({
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
  }

  beforeEach(async(() => {
    const mockRoute = createMockRoute(
      ['search/dev.dev', 'domains/dev.dev/serverstatus'],
      {domainName: 'dev.dev'}
    );

    const mockDomainEppService = {
      updateStatus: jasmine.createSpy('updateStatus'),
      info: jasmine.createSpy('info'),
    };
    const mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainStatusComponent);
    router = TestBed.get(ActivatedRoute);
    route = TestBed.get(Router);
    domainEppService = TestBed.get(DomainEppService);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should add status values that have been checked', async(() => {
    resolveDomain(['ok']);
    domainEppService.updateStatus.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
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
        expect(domainEppService.updateStatus).toHaveBeenCalledWith('dev.dev',
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
        expect(domainEppService.updateStatus).toHaveBeenCalledTimes(1);
        expect(route.navigate).toHaveBeenCalledWith(['../'], {relativeTo: router});
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('should remove status values that have been unchecked', async(() => {
    resolveDomain(['serverDeleteProhibited',
            'serverHold',
            'serverRenewProhibited',
            'serverTransferProhibited',
            'serverUpdateProhibited',
            'clientDeleteProhibited',
            'clientHold',
            'clientRenewProhibited',
            'clientTransferProhibited',
            'clientUpdateProhibited']);
    domainEppService.updateStatus.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
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
      fixture.detectChanges();
      page.clickSubmit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(domainEppService.updateStatus).toHaveBeenCalledWith('dev.dev',
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
        expect(domainEppService.updateStatus).toHaveBeenCalledTimes(1);
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));

  it('should not update any status values if form is not updated', async(() => {
    domainEppService.updateStatus.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickSubmit();
      fixture.whenStable().then(() => {
        expect(domainEppService.updateStatus).toHaveBeenCalledWith('dev.dev', [ ], [ ]);
        expect(domainEppService.updateStatus).toHaveBeenCalledTimes(1);
      }).catch(err => fail(err));
    }).catch(err => fail(err));
  }));
});
