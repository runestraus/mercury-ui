import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { SearchComponent } from "./search/search.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
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
    { path: 'search/:query', component: SearchComponent, children: [] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }