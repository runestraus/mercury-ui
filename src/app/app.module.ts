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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchComponent } from './search/search.component';
import { SearchService } from './service/search.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldService } from './service/tld.service';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { LoginComponent } from './login/login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SessionService } from './service/session.service';
import { MeService } from './service/me.service';
import { UsersService } from './service/users.service';
import { RolesService } from './service/roles.service';
import { HttpClient } from './shared/http.client';
import { PermissionService } from './service/permission.service';
import { DomainComponent } from './search/domain/domain.component';
import { HostComponent } from './search/host/host.component';
import { ContactComponent } from './search/contact/contact.component';
import { PremiumNameComponent } from './search/premium-name/premium-name.component';
import { ReservedNameComponent } from './search/reserved-name/reserved-name.component';
import { DpmlComponent } from './search/dpml/dpml.component';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { SharedModule } from 'primeng/components/common/shared';
import { MenuComponent } from './menu/menu.component';
import { IcannTldComponent } from './icann/icann-tld/icann-tld.component';
import { IcannDnsComponent } from './icann/icann-dns/icann-dns.component';
import { IcannRegistrarComponent } from './icann/icann-registrar/icann-registrar.component';
import { IcannService } from './service/icann.service';
import { CalendarModule, DropdownModule } from 'primeng/primeng';
import { UsersComponent } from './users/users.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { ContactEppService } from './contacts/contactepp.service';
import { TextStringService } from './service/textstring.service';
import { EppHelperService } from './epp/epphelper.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchBarComponent,
    SearchComponent,
    DashboardComponent,
    TldsIndexComponent,
    TldsCreateComponent,
    LoginComponent,
    DomainComponent,
    HostComponent,
    ContactComponent,
    PremiumNameComponent,
    ReservedNameComponent,
    DpmlComponent,
    MenuComponent,
    IcannTldComponent,
    IcannDnsComponent,
    IcannRegistrarComponent,
    MenuComponent,
    ContactCreateComponent,
    UsersComponent
  ],
  imports: [
    DropdownModule,
    DataTableModule,
    CalendarModule,
    SharedModule,
    DialogModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    SearchService,
    TldService,
    UsersService,
    SessionService,
    MeService,
    PermissionService,
    HttpClient,
    ContactEppService,
    EppHelperService,
    TextStringService,
    IcannService,
    RolesService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
