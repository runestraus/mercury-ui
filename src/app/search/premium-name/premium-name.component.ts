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

import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { CategorizedPremiumName } from '../../model/categorized-premium-name.model';
import { RequestOptions, Headers, Request, RequestMethod } from '@angular/http';
import { ToolsService } from '../../service/tools.service';
import { CSV } from '../../model/csv.model';

@Component({
  selector: 'app-premium-name',
  templateUrl: './premium-name.component.html',
  styleUrls: ['./premium-name.component.css']
})
export class PremiumNameComponent implements OnInit {
  errorMessage: string;
  displayDialog: boolean;
  error: string;
  isDownloadDisabled: boolean;
  hideResult: boolean;
  hideChanges: boolean;
  hideErrors: boolean;
  errorData: string[];
  token: string;
  url = '/api/premiumnames/csv';
  dialogResult: CSV = new CSV;
  uploadResult: CSV = new CSV;
  uploadResultDetails: {};
  creates: Object;
  deletes: Object;
  updates: Object;
  csvFile = [];

  @Input() premiumNames: CategorizedPremiumName[];
  constructor(private toolsService: ToolsService, private elRef: ElementRef) { }

  ngOnInit() {
    this.displayDialog = true;
    this.clearContentArea();
    if (this.premiumNames === undefined) {
      this.isDownloadDisabled = true;
    } else {
      this.flattenJSON();
    }
  }

  flattenJSON() {
    this.premiumNames.forEach(element => {
      const ar = {
        Operation: 'U',
            Domain: element.name,
            PriceCategory: element.category,
            NewPriceCategory: element.futureCategory,
            'EffectiveYYYY-MM-DD': element.changeDate
      };
      this.csvFile.push(ar);
    });
  }

  exportCSV() {
    this.toolsService.JSONToCSVConvertor(this.csvFile, 'PremiumNames');
  }

  downloadTemplate(param: string) {
    this.toolsService.downloadTemplate(param);
    this.displayDialog = false;
  }

  getUploadButton() {
    const btn = this.elRef.nativeElement.querySelector('button[icon=fa-upload]');
    return btn;
  }

  clearContentArea() {
    this.hideChanges = true;
    this.hideErrors = true;
    this.hideResult = true;
    this.error = null;
  }

  validateFile(event: Event) {
    this.hideErrors = true;
    this.toolsService.validateCSV(this.url, event)
      .then(displayResult => {
        this.error = null;
        this.hideChanges = false;
        this.hideResult = true;
        this.dialogResult = displayResult;
        this.token = displayResult.token;
        this.getUploadButton().disabled = false;
      })
      .catch(error => {
        this.getUploadButton().disabled = true;
        this.displayDialog = true;
        this.hideResult = true;
        this.hideChanges = true;
        if (Array.isArray(error)) {
          this.hideErrors = false;
          this.errorData = error;
        } else {
          this.error = error;
        }
      });
  }

  uploadCSV(event: Event) {
    this.toolsService.uploadCSV(this.url + '/' + this.token)
      .then(uploadResult => {
        this.uploadResult = uploadResult;
        this.creates = uploadResult.result.create;
        this.deletes = uploadResult.result.delete;
        this.updates = uploadResult.result.update;
        this.hideChanges = true;
        this.hideResult = false;
      })
      .catch(error => {
        this.displayDialog = true;
        this.error = error;
      });
  }

  cancelDialog() {
    this.displayDialog = false;
  }
}
