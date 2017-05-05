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
import { SearchBarComponent } from './navbar/search-bar/search-bar.component';
import { SearchComponent } from './search/search.component';
import { SearchService } from './service/search.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldService } from './service/tld.service';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { LoginComponent } from './login/login.component';
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
import { MenuComponent } from './navbar/menu/menu.component';
import { IcannTldComponent } from './icann/icann-tld/icann-tld.component';
import { IcannDnsComponent } from './icann/icann-dns/icann-dns.component';
import { IcannRegistrarComponent } from './icann/icann-registrar/icann-registrar.component';
import { IcannService } from './service/icann.service';
import { CalendarModule, DropdownModule, FileUploadModule, TooltipModule, ChartModule } from 'primeng/primeng';
import { UsersComponent } from './users/users.component';
import { ContactCreateComponent } from './contacts/contact-create/contact-create.component';
import { ContactEppService } from './contacts/contactepp.service';
import { TextStringService } from './service/textstring.service';
import { EppHelperService } from './epp/epphelper.service';
import { PriceCategoriesComponent } from './price-categories/price-categories.component';
import { PriceCategoriesService } from './service/price-categories.service';
import { HostCreateComponent } from './hosts/host-create/host-create.component';
import { HostEppService } from './hosts/hostepp.service';
import { DomainEppService } from './service/domain-epp.service';
import { ToolsService } from './service/tools.service';
import { GoogleOauthService } from './service/google-oauth.service';
import { GapiLoader } from './service/gapi-loader.service';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { DomainInfoComponent } from './domains/domain-info/domain-info.component';
import { DomainInfoStatusComponent } from './domains/domain-info/domain-info-status/domain-info-status.component';
import { DomainInfoSeparatorComponent } from './domains/domain-info/domain-info-separator/domain-info-separator.component';
import { DomainInfoContactsComponent } from './domains/domain-info/domain-info-contacts/domain-info-contacts.component';
import { DomainInfoHostsComponent } from './domains/domain-info/domain-info-hosts/domain-info-hosts.component';
import { DisplayListComponent } from './shared/components/display-list/display-list.component';
import { DomainStatusComponent } from './domains/domain-status/domain-status.component';
import { DomainInfoDetailComponent } from './domains/domain-info-detail/domain-info-detail.component';
import { DomainCreateComponent } from './domains/domain-create/domain-create.component';
import { CanDirective } from './shared/directives/can.directive';
import { CanNotDirective } from './shared/directives/can-not.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactsComponent } from './contacts/contacts/contacts.component';
import { DomainDeleteComponent } from './domains/domain-delete/domain-delete.component';
import { DomainLabelsService } from './service/domain.lables.service';
import { DomainHostsEditComponent } from './domains/domain-info/domain-edit-hosts/domain-hosts-edit.component';
import { DomainRestoreComponent } from './domains/domain-restore/domain-restore.component';
import { DomainRenewComponent } from './domains/domain-renew/domain-renew.component';
import { RegistrarService } from './service/registrar.service';

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
    ContactCreateComponent,
    UsersComponent,
    IcannTldComponent,
    IcannDnsComponent,
    IcannRegistrarComponent,
    MenuComponent,
    ContactCreateComponent,
    UsersComponent,
    PriceCategoriesComponent,
    HostCreateComponent,
    ClickOutsideDirective,
    DomainInfoComponent,
    DomainInfoStatusComponent,
    DomainInfoSeparatorComponent,
    DomainInfoContactsComponent,
    DomainInfoHostsComponent,
    DisplayListComponent,
    DomainStatusComponent,
    DomainInfoDetailComponent,
    DomainCreateComponent,
    CanDirective,
    CanNotDirective,
    DomainDeleteComponent,
    DomainHostsEditComponent,
    ContactsComponent,
    DomainRestoreComponent,
    DomainRenewComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    DropdownModule,
    FileUploadModule,
    DataTableModule,
    CalendarModule,
    SharedModule,
    DialogModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TooltipModule,
    ChartModule,
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
    HostEppService,
    EppHelperService,
    TextStringService,
    IcannService,
    RolesService,
    PriceCategoriesService,
    DomainEppService,
    ToolsService,
    GoogleOauthService,
    GapiLoader,
    RegistrarService,
    DomainLabelsService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
