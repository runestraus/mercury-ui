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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchComponent } from './search.component';
import { ActivatedRoute, Router, RouterOutletMap } from '@angular/router';
import { SearchService } from '../service/search.service';
import { Domain } from '../model/domain.model';
import { SearchResults } from '../model/search-results.model';
import { DataResults } from '../model/data-results.model';
import { createMockRoute, DocQuery } from '../shared/testutils';
import { DomainComponent } from './domain/domain.component';
import { Host } from '../model/host.model';
import { HostComponent } from './host/host.component';
import { PremiumNameComponent } from './premium-name/premium-name.component';
import { ReservedNameComponent } from './reserved-name/reserved-name.component';
import { ContactComponent } from './contact/contact.component';
import { DpmlComponent } from './dpml/dpml.component';
import { Contact } from '../model/contact.model';
import { Dpml } from '../model/dpml.model';
import { CategorizedPremiumName } from '../model/categorized-premium-name.model';
import { Money } from '../model/money.model';
import { ReservedName } from '../model/reserved-name.model';
import { FormsModule } from '@angular/forms';
import { DataTableModule, DialogModule } from 'primeng/primeng';
import { HttpModule } from '@angular/http';
import { ToolsService } from '../service/tools.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class Page {
  query: DocQuery<SearchComponent>;

  constructor(private fixture: ComponentFixture<SearchComponent>) {
    this.query = new DocQuery(fixture);
  }
  getHeaderName(col): string {
    const deDomainColumnHeader = this.query.getElementsByCss('.ui-column-title');
    expect(deDomainColumnHeader[col]).toBeTruthy();
    const elDomainHeader = deDomainColumnHeader[col].nativeElement;
    return elDomainHeader === null ? null : elDomainHeader.innerText;
  }
  getErrorMessage(): string {
    const deSearchTable = this.query.getElementByCss('#searchError');
    return deSearchTable === null ? null : deSearchTable.nativeElement.textContent;
  }
  verifyDomainSearchTable() {
    const domainSearchTable = this.query.getElementByCss('#domainsTable');
    expect(domainSearchTable).toBeTruthy();
    const elDomainSearchTable = domainSearchTable.nativeElement;
    expect(elDomainSearchTable).toBeTruthy();
  };
  verifyReservedNamesSearchTable() {
    const deSearchTable = this.query.getElementByCss('#reservedNamesTable');
    expect(deSearchTable).toBeTruthy();
    const elSearchTable = deSearchTable.nativeElement;
    expect(elSearchTable).toBeTruthy();
  }
  verifyPremiumNamesSearchTable() {
    const deSearchTable = this.query.getElementByCss('#premiumPriceTable');
    expect(deSearchTable).toBeTruthy();
    const elSearchTable = deSearchTable.nativeElement;
    expect(elSearchTable).toBeTruthy();
  }
  verifyDpmlSearchTable() {
    const deSearchTable = this.query.getElementByCss('#dpmlTable');
    expect(deSearchTable).toBeTruthy();
    const elSearchTable = deSearchTable.nativeElement;
    expect(elSearchTable).toBeTruthy();
  }
  verifyContactsSearchTable() {
    const deSearchTable = this.query.getElementByCss('#contactsTable');
    expect(deSearchTable).toBeTruthy();
    const elSearchTable = deSearchTable.nativeElement;
    expect(elSearchTable).toBeTruthy();
  }
  verifyHostSearchTable() {
    const deSearchTable = this.query.getElementByCss('#hostsTable');
    expect(deSearchTable).toBeTruthy();
    const elSearchTable = deSearchTable.nativeElement;
    expect(elSearchTable).toBeTruthy();
  }
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService;
  let router;
  let route;
  let page: Page;
  const price: Money = {
    'value': 22.99,
    'currency': 'USD'
  };
  const reservedNameResults: ReservedName[] = [{
    name: 'dev.dev',
    reservationType: 'FULLY_BLOCKED',
    tags: '',
    registered: true,
  }];
  const premiumNameResults: CategorizedPremiumName[] = [{
    name: 'domains.dev',
    category: 'AA',
    price: price,
    futureCategory: 'AA+',
    changeDate: null,
  }];
  const mockRoute = createMockRoute(['search/dev.dev'], { query: 'dev**.dev'});

  const mockSearchService = {
    getSearchResults: jasmine.createSpy('searchService.getSearchResults'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: {
      subscribe: jasmine.createSpy('subscribe')
    }
  };

  const toolsService = {
    JSONToCSVConvertor: jasmine.createSpy('JSONToCSVConvertor'),
    downloadTemplate: jasmine.createSpy('downloadTemplate'),
    validateCSV: jasmine.createSpy('validateCSV'),
    uploadCSV: jasmine.createSpy('uploadCSV')
  };

  beforeEach(async(() => {
    mockRouter.events.subscribe.and.returnValue({
      unsubscribe: jasmine.createSpy('unsubscribe')
    });
    TestBed.configureTestingModule({
      declarations: [ SearchComponent, DomainComponent, HostComponent, PremiumNameComponent,
        ReservedNameComponent, DpmlComponent, ContactComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [ FormsModule, DialogModule, DataTableModule, HttpModule, BrowserAnimationsModule],
      providers: [
        RouterOutletMap,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: SearchService, useValue: mockSearchService },
        { provide: Router, useValue: mockRouter },
        { provide: ToolsService, useValue: toolsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    searchService = TestBed.get(SearchService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
  });
  it('should have search error table after invalid domain search', async(() => {
    searchService.getSearchResults.and.returnValue(Promise.reject('Only one wildcard allowed'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('Only one wildcard allowed');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have domain table after domain search', async(() => {
    mockRoute.snapshot.params['query'] = 'dev.dev';
    const domainResults: Domain[] = [{
      domainName: 'dev.dev',
      status: 'OK',
      systemTags: '',
      tld: 'dev',
      price: price,
      priceCategory: 'A+',
      ianaNumber: 9999,
      registrar: 'brodaddy',
      currentSponsorClientId: '1234',
      contacts: null,
      hosts: null,
    }];
    const dataResults: DataResults[] = [{
      type: 'DOMAINS',
      dataList: domainResults,
    }];
    const searchResults: SearchResults = {
      data: dataResults,
    };
    searchService.getSearchResults.and.returnValue(Promise.resolve(searchResults));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.verifyDomainSearchTable();
      expect(page.getHeaderName(0)).toBe('Domain');
      expect(page.getHeaderName(1)).toBe('TLD');
      expect(page.getHeaderName(2)).toBe('Status');
      expect(page.getHeaderName(3)).toBe('System Tags');
      expect(page.getHeaderName(4)).toBe('Price');
      expect(page.getHeaderName(5)).toBe('Category');
      expect(page.getHeaderName(6)).toBe('IANA ID');
      expect(page.getHeaderName(7)).toBe('Registrar');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have search error table after invalid host search', async(() => {
    mockRoute.snapshot.params['query'] = 'h*.example.dev';
    searchService.getSearchResults.and.returnValue(Promise.reject('At least two characters must be specified before wildcard'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('At least two characters must be specified before wildcard');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have host table after host search', async(() => {
    mockRoute.snapshot.params['query'] = 'host.example.dev';
    const hostResults: Host[] = [{
      fullyQualifiedHostName: 'host.example.dev',
    }];
    const dataResults: DataResults[] = [{
      type: 'HOSTS',
      dataList: hostResults,
    }];
    const searchResults: SearchResults = {
      data: dataResults,
    };
    searchService.getSearchResults.and.returnValue(Promise.resolve(searchResults));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.verifyHostSearchTable();
      expect(page.getHeaderName(0)).toBe('Host');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have search error table after invalid contact search', async(() => {
    mockRoute.snapshot.params['query'] = 'b';
    searchService.getSearchResults.and.returnValue(Promise.reject('Contact id: \'b\' not found.'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('Contact id: \'b\' not found.');
    }).catch(err => {
        fail('Err: ' + err);
      });
  }));
  it('should have contact table after contact search', async(() => {
    mockRoute.snapshot.params['query'] = 'brodaddy';
    const contactResults: Contact[] = [{
      contactId: '1234',
      currentSponsorClientId: '9999',
      name: 'brodaddy',
      org: 'Donuts',
      type: 'INTERNATIONALIZED',
      deletionTime: null,
    }];
    const dataResults: DataResults[] = [{
      type: 'CONTACTS',
      dataList: contactResults,
    }];
    const searchResults: SearchResults = {
      data: dataResults,
    };
    searchService.getSearchResults.and.returnValue(Promise.resolve(searchResults));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.verifyContactsSearchTable();
      expect(page.getHeaderName(0)).toBe('Name');
      expect(page.getHeaderName(1)).toBe('Contact Id');
      expect(page.getHeaderName(2)).toBe('Current Sponsor Client Id');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have search error table after invalid dpml search', async(() => {
    mockRoute.snapshot.params['query'] = '!DPML d*ml.zone';
    searchService.getSearchResults.and.returnValue(Promise.reject('At least two characters must be specified before wildcard'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('At least two characters must be specified before wildcard');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have dpml table after dpml search', async(() => {
    mockRoute.snapshot.params['query'] = '!DPML .dpml';
    const domainResults: Domain[] = [{
      domainName: 'dpml.zone',
      status: 'INACTIVE',
      systemTags: '!DPML',
      tld: 'dpml.zone',
      price: price,
      priceCategory: 'A+',
      ianaNumber: 9999,
      registrar: 'brodaddy',
      currentSponsorClientId: '1234',
      contacts: null,
      hosts: null,
    }];
    const dpmlResults: Dpml[] = [{
      label: 'DpmlBlock',
      reservedNames: reservedNameResults,
      premiumNames: premiumNameResults,
      domainNames: domainResults,
    }];
    const dataResults: DataResults[] = [{
      type: '!DPML',
      dataList: dpmlResults,
    }];
    const searchResults: SearchResults = {
      data: dataResults,
    };
    searchService.getSearchResults.and.returnValue(Promise.resolve(searchResults));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.verifyDpmlSearchTable();
      expect(page.getHeaderName(0)).toBe('Label');
      expect(page.getHeaderName(1)).toBe('Domain');
      expect(page.getHeaderName(2)).toBe('TLD');
      expect(page.getHeaderName(3)).toBe('Status');
      expect(page.getHeaderName(4)).toBe('System Tags');
      expect(page.getHeaderName(5)).toBe('Price');
      expect(page.getHeaderName(6)).toBe('Category');
      expect(page.getHeaderName(7)).toBe('IANA ID');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
  it('should have premium names table after premium names search', async(() => {
    mockRoute.snapshot.params['query'] = '$ .dev';
    const dataResults: DataResults[] = [{
      type: '$',
      dataList: premiumNameResults,
    }];
    const searchResults: SearchResults = {
      data: dataResults,
    };
    searchService.getSearchResults.and.returnValue(Promise.resolve(searchResults));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.verifyPremiumNamesSearchTable();
      expect(page.getHeaderName(0)).toBe('Domain');
      expect(page.getHeaderName(1)).toBe('Category');
      expect(page.getHeaderName(2)).toBe('Amount');
      expect(page.getHeaderName(3)).toBe('Future Category');
      expect(page.getHeaderName(4)).toBe('Change Date');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
 it('should have reserved names table after reserved names search', async(() => {
    mockRoute.snapshot.params['query'] = '!RSV .dev';
    const dataResults: DataResults[] = [{
      type: '!RSV',
      dataList: reservedNameResults,
    }];
    const searchResults: SearchResults = {
      data: dataResults,
    };
    searchService.getSearchResults.and.returnValue(Promise.resolve(searchResults));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.verifyReservedNamesSearchTable();
      expect(page.getHeaderName(0)).toBe('Domain');
      expect(page.getHeaderName(1)).toBe('Tags');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
});
