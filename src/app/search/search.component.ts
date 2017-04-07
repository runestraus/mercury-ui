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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../service/search.service';
import { Domain } from '../model/domain.model';
import { Contact } from '../model/contact.model';
import { Host } from '../model/host.model';
import { CategorizedPremiumName } from '../model/categorized-premium-name.model';
import { ReservedName } from '../model/reserved-name.model';
import { DataResults } from '../model/data-results.model';
import { Dpml } from '../model/dpml.model';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  domainResult: Domain[];
  hostResult: Host[];
  contactResult: Contact[];
  premiumNameResults: CategorizedPremiumName[];
  reservedNameResults: ReservedName[];
  dpmlResults: Dpml[];
  searchData: DataResults[];
  query: string;
  error: any;
  searchType: string;
  displayItems: any[];
  busy: Promise<any>;

  constructor(private route: ActivatedRoute,
              private searchService: SearchService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
          this.callSearch(params);
        },
        err => {
          this.error = err.toString();
        });
  };

  callSearch(value: Params) {
    this.query = value['query'];
    this.clearSearchData();
    this.searchService.getSearchResults(this.query)
      .then( searchResult => {
        this.searchData = searchResult.data;
        if (this.searchData !== undefined && this.searchData[0].dataList.length > 0) {
          this.error = null;
          this.searchType = this.searchData[0].type;
          this.displayItems = [].concat(this.searchData[0].dataList);
          // Display result based upon search type
          switch (this.searchType) {
            case('!RSV'):
              this.reservedNameResults = this.displayItems;
              break;
            case('$'):
              this.premiumNameResults = this.displayItems;
              break;
            case('DOMAINS'):
              this.domainResult = this.displayItems;
              break;
            case('HOSTS'):
              this.hostResult = this.displayItems;
              break;
            case('CONTACTS'):
              this.contactResult = this.displayItems;
              break;
            case('!DPML'):
              this.dpmlResults = this.displayItems;
              break;
          }}})
      .catch(err => {
        this.error = err.toString();
      });
  }

  clearSearchData() {
    this.domainResult = null;
    this.hostResult = null;
    this.contactResult = null;
    this.premiumNameResults = null;
    this.reservedNameResults = null;
    this.dpmlResults = null;
  }
}
