import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SearchBarComponent} from "./search-bar/search-bar.component";
import {RouterModule} from "@angular/router";
import {SearchComponent} from "./search/search.component";
import {SearchService} from "./service/search.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TldsIndexComponent} from "./tlds/tlds-index/tlds-index.component";
import {TldService} from "./service/tld.service";
import {TldsCreateComponent} from "./tlds/tlds-create/tlds-create.component";
import {DialogModule} from "primeng/components/dialog/dialog";
import {PermissionService} from "./service/Permission.service";
import {AppRoutingModule} from './app-routing.module';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService}  from './in-memory-data.service';
import {PermissonDetailComponent} from './permission-detail/permisson-detail.component';
import {RegistryAPIService} from "./service/RegistryAPI.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchBarComponent,
    SearchComponent,
    DashboardComponent,
    TldsIndexComponent,
    TldsCreateComponent,
    PermissonDetailComponent
  ],
  imports: [
    DialogModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'search/:query',
        component: SearchComponent,
        children: []
      },
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'tlds',
        component: TldsIndexComponent,
        children: [
          {
            path: 'new',
            component: TldsCreateComponent
          }
        ]
      }
    ])
  ],
  providers: [SearchService, TldService, PermissionService, RegistryAPIService],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
