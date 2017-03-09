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

import { Component, OnInit} from '@angular/core';
import { MeService } from '../service/me.service';
import 'rxjs/add/operator/toPromise';
import {User} from '../model/user.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isActive: boolean;
  user: User;
  errorMessage: string;

  constructor(private meService: MeService) {}

  showNavItem(permission): boolean {
    return this.user.permissions.some(perm => perm === permission);
  }

  ngOnInit() {
    this.meService.get()
      .then(user => {
        this.user = user;
      });
  }

  toggle() {
    this.isActive = !this.isActive;
  }
}