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

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomainEppService } from '../../service/domain-epp.service';
import { DomainDetail } from '../../model/domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { getParentRouteUrl } from '../../shared/routeutils';

@Component({
  selector: 'app-domain-status',
  templateUrl: './domain-status.component.html',
  styleUrls: ['./domain-status.component.css']
})
export class DomainStatusComponent implements OnInit {
  domainName: string;
  domainDetail: DomainDetail;
  showDialog: boolean;
  domainStatusForm: FormGroup;
  loading = true;
  error: string = null;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private domainEppService: DomainEppService) {
  }

  ngOnInit() {
    this.domainName = this.route.parent.snapshot.params['domainName'];
    this.getDomain();
    this.createForm();
    this.showDialog = true;
  }

  getDomain() {
    this.domainEppService.info(this.domainName, null).then(domainDetail => {
      this.loading = false;
      this.domainDetail = domainDetail;
    }).catch(err => {
      this.loading = false;
      // switch these blocks of code to test out the partial domain info display
      if (err.code && err.message) {
        this.error = err.message;
      } else {
        console.error(err);
        this.error = 'There was an error getting domain info';
      }
    });
  };
  onSubmit() {
    const statusData = this.prepareStatusesForSave();
    this.showDialog = false;
    this.domainEppService.updateStatus(this.domainName, statusData._addStatuses, statusData._remStatuses)
      .then(() => {
        this.onCloseClicked();
        this.router.navigate([getParentRouteUrl(this.route)]);
      })
      .catch(error => {
        if (error.code && error.message) {
          this.error = error.message;
        } else {
          console.error(error);
          this.error = 'There was an error updating domain info';
        }
      });
    this.router.navigate([getParentRouteUrl(this.route)]);
  }

  prepareStatusesForSave(): StatusData {
    const serverFormModel = this.domainStatusForm.value;
    const statusData: StatusData = new StatusData();
    Object.keys(serverFormModel).forEach(key => {
      if (serverFormModel[key]) {
        statusData._addStatuses.push(key);
      } else {
        statusData._remStatuses.push(key);
      }
    });
    return statusData;
  }

  createForm() {
    this.domainStatusForm = this.fb.group({
      serverDeleteProhibited: [''],
      serverHold: [''],
      serverRenewProhibited: [''],
      serverTransferProhibited: [''],
      serverUpdateProhibited: [''],
      clientDeleteProhibited: [''],
      clientHold: [''],
      clientRenewProhibited: [''],
      clientTransferProhibited: [''],
      clientUpdateProhibited: [''],
    });
  }

  onCloseClicked() {
    this.router.navigate([getParentRouteUrl(this.route)]);
  }
}

export class StatusData {
  _addStatuses = new Array();
  _remStatuses = new Array();
}
