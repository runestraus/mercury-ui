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
import { Component, Input } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { UserData } from '../../model/profile.model';
import { User } from '../../model/user.model';
import { RegistrarUser } from '../../model/users.model';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css']
})
export class MenuComponent {
  isActive: boolean;
  errorMessage: string;
  @Input() user: User;
  constructor() {}

  showNavItem(permission): boolean {
    return this.user.permissions.some(perm => perm === permission);
  }

  toggle() {
    this.isActive = !this.isActive;
  }
}
