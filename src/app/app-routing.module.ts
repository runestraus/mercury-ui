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
    { path: 'search/:query', component: SearchComponent, children: [] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
