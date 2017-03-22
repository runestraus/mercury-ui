// Copyright 2017 Donuts Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { SearchComponent } from './search/search.component';
import { IcannRegistrarComponent } from './icann/icann-registrar/icann-registrar.component';
import { IcannDnsComponent } from './icann/icann-dns/icann-dns.component';
import { IcannTldComponent } from './icann/icann-tld/icann-tld.component';
import { UsersComponent } from './users/users.component';
import { PriceCategoriesComponent } from './price-categories/price-categories.component';
import { HostCreateComponent } from './hosts/host-create/host-create.component';
import { DomainInfoComponent } from './domains/domain-info/domain-info.component';

export const routes: Routes = [
  { path: '',  component: DashboardComponent },
  {
      path: 'tlds',
      component: TldsIndexComponent,
      children: [
          {
            path: 'new',
            component: TldsCreateComponent
          }
      ]
    },
  {
      path: 'search/:query',
      component: SearchComponent,
      children: [
          {
              path: 'domains/:domainName',
              component: DomainInfoComponent,
              children: []
          },
      ]
  },
  { path: 'icann/icanntld', component: IcannTldComponent, children: [] },
  { path: 'icann/icanndns', component: IcannDnsComponent, children: [] },
  { path: 'icann/icannregistrar', component: IcannRegistrarComponent, children: [] },
  { path: 'search/:query', component: SearchComponent, children: [] },
  { path: 'users', component: UsersComponent, children: [] },
  { path: 'pricecategories', component: PriceCategoriesComponent, children: [] },
  { path: 'users', component: UsersComponent, children: [] },
  { path: 'hosts/:fullyQualifiedHostName', component: HostCreateComponent, children: [] },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
