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
import { TldService } from '../../service/tld.service';
import 'rxjs/add/operator/toPromise';
import { Tld } from '../../model/tld.model';

@Component({
  selector: 'app-tlds-index',
  templateUrl: './tlds-index.component.html',
  styleUrls: ['./tlds-index.component.css']
})

export class TldsIndexComponent implements OnInit {
  displayDialog: boolean;
  displayTransitionsDialog: boolean;
  stateTransitions: string[];
  tld: Tld = new Tld();
  selectedTld: Tld;
  createTld: boolean;
  tlds: Tld[];
  error: string;
  createBillingCost: number;
  restoreBillingCost: number;

  constructor(private tldService: TldService) {}

  ngOnInit() {
    this.tldService.get()
      .then(tlds => {
        this.tlds = tlds;
      });
  }

  showTransitions(tld) {
    this.displayTransitionsDialog = true;
    this.tld = tld;
    this.stateTransitions = this.tldService.transform(tld);
  }

  onRowSelect(event) {
    this.createTld = false;
    this.tld = this.cloneTld(event.data);
    this.createBillingCost = this.tld.createBillingCost.value;
    this.restoreBillingCost = this.tld.restoreBillingCost.value;
    this.displayDialog = true;
  }

  cloneTld(t: Tld): Tld {
    const tld = this.selectedTld;
    for (const prop in t) {
      if (t.hasOwnProperty(prop)) {
        tld[prop] = t[prop];
      }
    }
    return tld;
  }

  showDialogToAdd() {
    this.createTld = true;
    this.displayDialog = true;
  }

  cancelDialog() {
    this.tld = new Tld();
    this.createBillingCost = null;
    this.restoreBillingCost = null;
    this.displayDialog = false;
    this.displayTransitionsDialog = false;
    this.error = null;
  }

  save() {
    if (this.createTld) {
      const newTLD = {
        'name': this.tld.name.toLowerCase(),
        'createBillingCost': {'value': this.createBillingCost, 'currency': 'USD'},
        'restoreBillingCost': {'value': this.restoreBillingCost, 'currency': 'USD'},
        'state': 'PREDELEGATION'
      };
      this.tlds.push(newTLD);
      this.tldService.post(newTLD)
      .then()
      .catch(error => {
        this.displayDialog = true;
        this.error = error;
      });
    } else {
      const updatedTLD = {
        'name': this.tld.name.toLowerCase(),
        'state': this.tld.state.toUpperCase(),
        'createBillingCost': {'value': this.createBillingCost, 'currency': 'USD'},
        'restoreBillingCost': {'value': this.restoreBillingCost, 'currency': 'USD'}
      };
      this.tld = updatedTLD;
      this.tldService.put(this.tld.name, updatedTLD)
      .then()
      .catch(error => {
        this.displayDialog = true;
        this.error = error;
      });
      this.tlds[this.findSelectedUserIndex()] = this.tld;
      this.createBillingCost = null;
      this.restoreBillingCost = null;
      this.tld = new Tld();
    }
    this.displayDialog = false;
  }

  findSelectedUserIndex(): number {
    return this.tlds.indexOf(this.selectedTld);
  }
}
