import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {AppRoutingModule} from "./app-routing.module";
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { SearchService } from './service/search.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldService } from './service/tld.service';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import {MenuComponent} from "./menu/menu.component";
import { LoginComponent } from './login/login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { SessionService } from './service/session.service';
import { MeService } from './service/me.service';
import { HttpClient } from './shared/http.client';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    SearchComponent,
    DashboardComponent,
    TldsIndexComponent,
    TldsCreateComponent,
    MenuComponent,
    LoginComponent
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
