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

import { Injectable } from '@angular/core';
import { HttpClient } from '../shared/http.client';
import 'rxjs/add/operator/toPromise';
import { HttpModule, RequestOptions, Headers, Response } from '@angular/http';
import { CSV } from '../model/csv.model';

@Injectable()
export class ToolsService {
  displayDialog: boolean;
  formData = new FormData();

  constructor(private http: HttpClient) { }

  /**
 * Validates file for upload.
 *
 * @returns {Promise<CSV>}
 */
  validateCSV(url: string, event): Promise<CSV> {
    const fileList: FileList = event.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.formData = new FormData();
      this.formData.append('title', 'file.csv');
      this.formData.append('file', file);
      return this.http.post(url, this.formData).toPromise()
        .then(res => res.json() as CSV)
        .catch(this.handleError);
    }
  }

  /**
  * Uploads file.
  *
  * @returns {Promise<CSV>}
  */
  uploadCSV(url: string): Promise<CSV> {
    return this.http.post(url, this.formData).toPromise()
      .then(res => res.json() as CSV)
      .catch(this.handleError);
  }

  /**
   * Download an apprpriate csv downloadTemplate
   *
   * @param param
   */
  downloadTemplate(param: string) {
    let fileName = '';
    let input = '';
    if (param === 'premium') {
      fileName = 'PremiumNamesTemplateCSV.csv';
      input = 'Operation,Domain,PriceCategory,NewPriceCategory,EffectiveYYYY-MM-DD\nC,example.donuts,,A,';
    } else {
      fileName = 'ReservedNamesTemplateCSV.csv';
      input = 'Operation,Domain,Tags\nC,example.donuts,';
    }

    this.createLink(fileName, input);
  }

  /**
   * Convert incoming array into a csv formatted data
   *
   * @param JSONData
   * @param ReportTitle
   */
  JSONToCSVConvertor(JSONData: string[], ReportTitle: string) {
    const arrData: Array<CSV> = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    let CSV = '';
    let row = '';

    for (const index in arrData[0]) {
      if (arrData[0].hasOwnProperty) {
        row += index + ',';
      }
    }
    row = row.slice(0, -1);
    CSV += row + '\r\n';

    for (let i = 0; i < arrData.length; i++) {
      row = '';
      for (const index in arrData[i]) {
        if (arrData[i].hasOwnProperty) {
          row += arrData[i][index] + ',';
        }
      }
      row.slice(0, row.length - 1);
      CSV += row.slice(0, -1) + '\r\n';
    }

    this.createLink(ReportTitle, CSV);
  }

  /**
   * Helper function for appending the anchor tag and remove it after automatic click
   *
   * @param fileName
   * @param input
   */
  createLink(fileName: string, input: string) {
    const blob = new Blob([input], { type: 'text/csv' });
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName + '.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.displayDialog = false;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.json().message || error);
  }
}
