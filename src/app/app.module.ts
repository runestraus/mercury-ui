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
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SearchService } from './service/search.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldService } from './service/tld.service';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SessionService } from './service/session.service';
import { MeService } from './service/me.service';
import { HttpClient } from './shared/http.client';
import { DomainComponent } from './search/domain/domain.component';
import { HostComponent } from './search/host/host.component';
import { ContactComponent } from './search/contact/contact.component';
import { PremiumNameComponent } from './search/premium-name/premium-name.component';
import { ReservedNameComponent } from './search/reserved-name/reserved-name.component';
import { DpmlComponent } from './search/dpml/dpml.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    SearchComponent,
    DashboardComponent,
    TldsIndexComponent,
    TldsCreateComponent,
    MenuComponent,
    LoginComponent,
    DomainComponent,
    HostComponent,
    ContactComponent,
    PremiumNameComponent,
    ReservedNameComponent,
    DpmlComponent
  ],
  imports: [
    DialogModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
  ],
  providers: [SearchService, TldService, SessionService, MeService, HttpClient],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
