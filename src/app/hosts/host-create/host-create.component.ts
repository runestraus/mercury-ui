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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HostEppService } from '../hostepp.service';
import { HostCreate } from '../host.model';
import { HostUpdateInfo, AddrInfo } from '../../epp/hostepp.template';
import { EppMessageAndStatus } from '../../epp/epphelper.service';
import { isUndefined } from 'util';
import { CustomValidator } from '../../validators/customValidator';
import { HostDetail } from '../host.model';
import { getParentRouteUrl } from '../../shared/routeutils';

@Component({
  selector: 'app-host-create',
  templateUrl: './host-create.component.html',
  styleUrls: ['./host-create.component.css']
})
export class HostCreateComponent implements OnInit {
  showHostDialog = true;
  hostForm: FormGroup;
  error: string;
  host: HostDetail;
  isEditForm = false;
  modalHeader = 'Create New Host';
  hostName: string;

  formErrors = {
    'inetAddress': '',
  };

  validationMessages = {
    'inetAddress': {
      'required': 'Host IP address is required.',

    },
  };

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private hostEppService: HostEppService) { }

  ngOnInit() {
    this.getHost();
    this.createForm();
  }

  getHost() {
    this.hostName = this.route.snapshot.params['fullyQualifiedHostName'];
    if (this.hostName) {
      this.modalHeader = 'Host: ' + this.hostName;
      this.isEditForm = true;

      this.hostEppService.infoHost(this.hostName)
        .then(host => {
          this.host = host;
          const inetAddresses = host.inetAddresses;
          this.removeInetAddress(0);
          const control = <FormArray>this.hostForm.controls['inetAddresses'];
          for (const addr of inetAddresses) {
            control.push(this.initAddress(addr));
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  createForm() {
    this.hostForm = this.fb.group({
      inetAddresses: this.fb.array([
        this.initAddress()
      ])
    });
  }

  getAddresses(hostForm) {
    return hostForm.get('inetAddresses').controls;
  }

  initAddress(addr?: string): FormGroup {
    return this.fb.group({
      inetAddress: [addr, [Validators.required, CustomValidator.validateipV4RegEx]]
    });
  }

  convertToAddrInfos(addrs: Array<string>): Array<AddrInfo> {
    return addrs.map((address: string) => {
      return { value: address };
    });
  }

  /** Returns the addrs that are present in addrs1 but missing in addrs2 */
  getMissingAddrs(addrs1: Array<string>, addrs2: Array<string>): Array<string> {
    // Use lookup object to avoid n squared comparisons
    const lookup = addrs2.reduce((result, addr) => { result[addr] = true; return result; }, {});
    const result: Array<string> = [];
    for (const addr of addrs1) {
      if (!lookup[addr]) {
        result.push(addr);
      }
    }
    return result;
  }

  /**
   * Gets current host from form and submits to update or create.
   */
  onSubmit() {
    const hostCreated = this.prepareSaveContact();
    const hostAddrs = hostCreated.inetAddresses.filter(
      ipAddress => ipAddress.length > 0);
    let result: Promise<EppMessageAndStatus> = null;
    if (this.isEditForm) {
      const hostAddAddrs = this.getMissingAddrs(hostAddrs, this.host.inetAddresses);
      const hostRemAddrs = this.getMissingAddrs(this.host.inetAddresses, hostAddrs);

      const hostUpdateInfo: HostUpdateInfo = {
        addAddrs: this.convertToAddrInfos(hostAddAddrs),
        remAddrs: this.convertToAddrInfos(hostRemAddrs),
      };
      result = this.hostEppService.updateHost(this.hostName, hostUpdateInfo);
    } else {
      result = this.hostEppService.createHost(this.hostName, hostCreated.inetAddresses);
    }
    result.then(() => {
      this.router.navigate(['../..'], { relativeTo: this.route });
    }).catch(error => {
      this.error = error.message;
    });
  }

  addInetAddress() {
    const control = <FormArray>this.hostForm.controls['inetAddresses'];
    control.push(this.initAddress());
  }

  removeInetAddress(i) {
    const control = <FormArray>this.hostForm.controls['inetAddresses'];
    control.removeAt(i);
  }

  /**
   * Returns a contact created from the current form model.
   */
  prepareSaveContact(): HostCreate {
    const formModel = this.hostForm.value;
    formModel.inetAddresses = formModel.inetAddresses.map(
      addr => addr.inetAddress);
    const saveHost: HostCreate = {
      fullyQualifiedHostName: this.hostName,
      inetAddresses: formModel.inetAddresses
    };
    return saveHost;
  }

  cancelDialog() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  /**
   * Updates formErrors object with validation messages when form changes.
   */
  onValueChanged() {
    if (!this.hostForm) { return; }
    const form = this.hostForm;

    Object.keys(this.formErrors).map(field => {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        Object.keys(control.errors).map(key => {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }
}
