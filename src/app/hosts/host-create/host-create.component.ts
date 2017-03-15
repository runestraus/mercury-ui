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
import { isUndefined } from 'util';
import { CustomValidator } from '../../validators/customValidator';

@Component({
  selector: 'app-host-create',
  templateUrl: './host-create.component.html',
  styleUrls: ['./host-create.component.css']
})
export class HostCreateComponent implements OnInit {
  showHostDialog = true;
  hostForm: FormGroup;
  error: string;
  host: any;
  isEditForm = false;
  modalHeader = 'Create New Host';
  remAddrs: Array<string>;

  formErrors = {
    'fullyQualifiedHostName': '',
    'inetAddress': '',
  };

  validationMessages = {
    'fullyQualifiedHostName': {
      'required': 'Host name is required.'
    },
    'inetAddress': {
    'required': 'Host IP address is required.',

    },
  };

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private hostEppService: HostEppService) { }

  ngOnInit() {
    this.createForm();
    const hostName = this.route.snapshot.params['fullyQualifiedHostName'];
    if (hostName) {
      this.modalHeader = 'Edit Host';
      this.isEditForm = true;
      this.hostForm.get('fullyQualifiedHostName').enable();

      this.hostEppService.infoHost(hostName)
        .then(host => {
          this.host = host;
          this.hostForm.setValue({
            fullyQualifiedHostName: host.fullyQualifiedHostName,
            inetAddresses: host.inetAddresses,
          });
        })
      .catch(error => {
      });
    }
  }

  /**
   * Gets current host from form and submits to update or create.
   */
  onSubmit() {
    const hostCreated = this.prepareSaveContact();
    if (this.isEditForm) {
      const hostAddAddr: AddrInfo[] = hostCreated.inetAddresses.map(ipAddress => {
        return {
          value: ipAddress
        } as AddrInfo;
      });
      let hostRemoveAddr: AddrInfo[];
      if (!isUndefined(this.remAddrs)) {
        hostRemoveAddr = this.remAddrs.map(address => {
          return {
            value: address
          } as AddrInfo;
        });
      }
      const hostUpdateInfo: HostUpdateInfo = {
        addAddrs: hostAddAddr,
        remAddrs: hostRemoveAddr
      };

      this.hostEppService.updateHost(hostCreated.fullyQualifiedHostName, hostUpdateInfo)
        .then(host => {
          this.host = host;
          this.showHostDialog = false;
          this.hostForm.reset();
        }).catch(error => {
        this.error = error.message;
      });
      this.remAddrs = null;
      if (isUndefined(this.error)) {
        this.router.navigate(['/search/' + hostCreated.fullyQualifiedHostName]);
      }
    } else {
      this.hostEppService.createHost(hostCreated.fullyQualifiedHostName, hostCreated.inetAddresses)
        .then(host => {
          this.host = host;
          this.showHostDialog = false;
          this.hostForm.reset();
        }).catch(error => {
        this.error = error.message;
      });
    }
  }

  createForm() {
    this.hostForm = this.fb.group({
      fullyQualifiedHostName: ['', Validators.required],
      inetAddresses: this.fb.array([
        this.fb.control('' , Validators.compose([Validators.required , CustomValidator.validateipV4RegEx]))
      ])
    });

    this.hostForm.valueChanges
      .subscribe(() => this.onValueChanged());

    this.onValueChanged();
  }

  get inetAddresses(): FormArray {
    return this.hostForm.get('inetAddresses') as FormArray;
  };

  addInetAddress() {
    const control = <FormArray>this.hostForm.controls['inetAddresses'];
    control.push(this.fb.control('' , Validators.compose([Validators.required , CustomValidator.validateipV4RegEx])));
  }

  removeInetAddress(i) {
    const control = <FormArray>this.hostForm.controls['inetAddresses'];
    if (control.at(i).value !== '') {
      if (this.remAddrs === undefined) {
        this.remAddrs = new Array(1);
      }
      this.remAddrs.push(control.at(i).value);
    }
    control.removeAt(i);
  }

  /**
   * Returns a contact created from the current form model.
   */
  prepareSaveContact(): HostCreate {
    this.hostForm.get('fullyQualifiedHostName').enable();
    const formModel = this.hostForm.value;
    const saveHost: HostCreate = {
      fullyQualifiedHostName: formModel.fullyQualifiedHostName,
      inetAddresses: formModel.inetAddresses
    };
    return saveHost;
  }

  cancelDialog() {
    const hostName = this.host ? this.host.fullyQualifiedHostName : null;
    this.showHostDialog = false;
    this.error = null;
    this.router.navigate(['/search/' + hostName]);
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
        Object.keys(control.errors).map(key =>  {
          this.formErrors[field] += messages[key] + ' ';
        });
      }
    });
  }
}
