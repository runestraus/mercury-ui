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

import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../service/users.service';
import { RolesService } from '../service/roles.service';
import 'rxjs/add/operator/toPromise';
import { User } from '../model/users.model';
import { Role } from '../model/roles.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayDialog: boolean;
  user: User = new User();
  selectedUser: User;
  createUser: boolean;
  users: User[];
  role: Role;
  selectedRole: string;
  error: string;

  constructor(private usersService: UsersService, private rolesService: RolesService) {}

  ngOnInit() {
    this.usersService.get()
      .then(users => {
        this.users = users;
      });

      this.rolesService.get()
      .then(roles => {
        this.role = roles;
      });
  }

  onRowSelect(event) {
    this.createUser = false;
    this.user = this.cloneUser(event.data);
    this.displayDialog = true;
  }

  cloneUser(u: User): User {
    const user = this.selectedUser;
    for (const prop in u) {
      if (u.hasOwnProperty(prop)) {
        user[prop] = u[prop];
      }
    }
    return user;
  }

  showDialogToAdd() {
    this.createUser = true;
    this.displayDialog = true;
  }

  cancelDialog() {
    this.user = new User();
    this.displayDialog = false;
    this.error = null;
  }

  save() {
    if (this.createUser) {
      this.users.push(this.user);
      this.usersService.post(this.user)
      .then()
      .catch(error => {
        this.displayDialog = true;
        this.error = error;
      });
    } else {
      this.usersService.put(this.user.email, this.user)
      .then()
      .catch(error => {
        this.displayDialog = true;
        this.error = error;
      });
      this.users[this.findSelectedUserIndex()] = this.user;
      this.user = new User();
    }
      this.displayDialog = false;
  }

  findSelectedUserIndex(): number {
    return this.users.indexOf(this.selectedUser);
  }
}
