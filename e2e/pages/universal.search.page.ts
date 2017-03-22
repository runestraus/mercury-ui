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

import { by, element } from 'protractor';
import { Actions } from '../utils/actions';

const action = new Actions();

export class UniversalSearchPage {

  txtSearchBox = element(by.id('searchTermInput'));
  btnSearch = element(by.id('searchButton'));
  tblPremiumDomainName = element(by.id('premiumPriceTable'));
  thHeaderPremiumDomainName = element(by.id('premiumDomainName'));
  tblReservedDomainName = element(by.id('reservedNamesTable'));
  thHeaderReservedDomainName = element(by.id('reservedDomainName'));
  tblHostName = element(by.id('hostsTable'));
  thHeaderHostName = element(by.id('hostName'));
  tblContactName = element(by.id('contactsTable'));
  thHeaderContactName = element(by.id('contactName'));
  tblDomainName = element(by.id('domainsTable'));
  thHeaderDomainName = element(by.id('domainName'));

  clearSearch() {
    this.txtSearchBox.clear();
  };

  clickSearchButton() {
    const e = this.btnSearch;
    action.set({
      e: e,
      a: 'click'
    });
  };

  isPremiumDomainTablePresent() {
    const e = this.tblPremiumDomainName;
    return action.is({
      e: e,
      a: 'shown'
    });
  };

  isFirstHeaderPremiumDomain() {
    const e = this.thHeaderPremiumDomainName;
    return action.get({
      e: e,
      a: 'text'
    });
  };

  isReservedDomainTablePresent() {
    const e = this.tblReservedDomainName;
    return action.is({
      e: e,
      a: 'shown'
    });
  };

  isFirstHeaderReservedDomain() {
    const e = this.thHeaderReservedDomainName;
    return action.get({
      e: e,
      a: 'text'
    });
  };

  isHostTablePresent() {
    const e = this.tblHostName;
    return action.is({
      e: e,
      a: 'shown'
    });
  };

  isFirstHeaderHost() {
    const e = this.thHeaderHostName;
    return action.get({
      e: e,
      a: 'text'
    });
  };

  isContactTablePresent() {
    const e = this.tblContactName;
    return action.is({
      e: e,
      a: 'shown'
    });
  };

  isFirstHeaderContact() {
    const e = this.thHeaderContactName;
    return action.get({
      e: e,
      a: 'text'
    });
  };

  isFirstHeaderDomain() {
    const e = this.thHeaderDomainName;
    return action.get({
      e: e,
      a: 'text'
    });
  };

  isDomainTablePresent() {
    const e = this.tblDomainName;
    return action.is({
      e: e,
      a: 'shown'
    });
  };
}

