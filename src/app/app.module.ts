import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NavbarComponent} from "./navbar/navbar.component";
import {SearchBarComponent} from "./search-bar/search-bar.component";
import {RouterModule} from "@angular/router";
import {SearchComponent} from "./search/search.component";
import {SearchService} from "./service/search.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TldsIndexComponent} from "./tlds/tlds-index/tlds-index.component";
import {TldService} from "./service/tld.service";
import {TldsCreateComponent, TldsCreateContent} from "./tlds/tlds-create/tlds-create.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchBarComponent,
    SearchComponent,
    DashboardComponent,
    TldsIndexComponent,
    TldsCreateComponent,
    TldsCreateContent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
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
        component: TldsIndexComponent
      }
    ])
  ],
  providers: [SearchService, TldService],
  entryComponents: [TldsCreateContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
