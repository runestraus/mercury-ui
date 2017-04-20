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
import { PremiumNameComponent } from './search/premium-name/premium-name.component';
import { ReservedNameComponent } from './search/reserved-name/reserved-name.component';
import { PriceCategoriesComponent } from './price-categories/price-categories.component';
import { HostCreateComponent } from './hosts/host-create/host-create.component';
import { DomainInfoComponent } from './domains/domain-info/domain-info.component';
import { DomainStatusComponent } from './domains/domain-status/domain-status.component';
import { DomainInfoDetailComponent } from './domains/domain-info-detail/domain-info-detail.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { ContactsComponent } from './contacts/contacts/contacts.component';
import { DomainDeleteComponent } from './domains/domain-delete/domain-delete.component';
import { DomainHostsEditComponent } from './domains/domain-info/domain-edit-hosts/domain-hosts-edit.component';
import { DomainRenewComponent } from './domains/domain-renew/domain-renew.component';

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
              children: [],
          },
          {
            path: 'domains/:domainName/details',
            component: DomainInfoDetailComponent,
            children: []
          },
          {
            path: 'domains/:domainName/contacts',
            component: ContactsComponent,
            children: [],
          },
          {
            path: 'domains/:domainName/contactedit/:contactId',
            component: ContactCreateComponent,
            children: [],
          },
          {
            path: 'domains/:domainName/contacts/edit/:contactId',
            component: ContactCreateComponent,
            children: [],
          },
          {
            path: 'domains/:domainName/contacts/edit',
            component: ContactCreateComponent,
            children: [],
          },
          {
            path: 'domains/:domainName/domaindelete',
            component: DomainDeleteComponent,
            children: [],
          },
          {
            path: 'domains/:domainName/hosts',
            component: DomainHostsEditComponent,
            children: []
          },
          {
            path: 'domains/:domainName/hostedit/:fullyQualifiedHostName',
            component: HostCreateComponent,
            children: [],
          },
          {
            path: 'domains/:domainName/hosts/edit/:fullyQualifiedHostName',
            component: HostCreateComponent,
            children: []
          },
          {
            path: 'domains/:domainName/hosts/edit',
            component: HostCreateComponent,
            children: []
          },
          {
            path: 'domains/:domainName/serverstatus',
            component: DomainStatusComponent,
            children: []
          },
          {
            path: 'domains/:domainName/domainrenew',
            component: DomainRenewComponent,
            children: []
          },
      ]
  },
  { path: 'icann/icanntld', component: IcannTldComponent, children: [] },
  { path: 'icann/icanndns', component: IcannDnsComponent, children: [] },
  { path: 'icann/icannregistrar', component: IcannRegistrarComponent, children: [] },
  { path: 'users', component: UsersComponent, children: [] },
  { path: 'premiumlists', component: PremiumNameComponent, children: [] },
  { path: 'reserveddomains', component: ReservedNameComponent, children: [] },
  { path: 'pricecategories', component: PriceCategoriesComponent, children: [] },
  { path: 'hosts/:fullyQualifiedHostName', component: HostCreateComponent, children: [] },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
