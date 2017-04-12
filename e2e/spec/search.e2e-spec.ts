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

import { browser } from 'protractor';
import { Address } from '../utils/address';
import { UniversalSearchPage } from '../pages/universal.search.page';

describe('Mercury UI App Search Smoke Test', function() {
  let page;

  beforeEach(function(done) {
    page = new UniversalSearchPage();
    const address = new Address();
    browser.get(address.getBaseUrl());
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    setTimeout(function () {
      done();
    }, 10000);
  });

  it('Should run all search scenarios.', function(done) {
    browser.sleep(500);
    page.txtSearchBox.sendKeys('best.pizza');
    page.clickSearchButton();
    page.isDomainTablePresent();
    page.clearSearch();
    page.txtSearchBox.sendKeys('$');
    page.clickSearchButton();
    page.isReservedModalPresent();
    page.clickCancelPremiumTools();
    page.isPremiumDomainTablePresent();
    page.clearSearch();
    page.txtSearchBox.sendKeys('!RSV');
    page.clickSearchButton();
    page.isReservedModsalPresent();
    page.clickCancelReservedTools();
    page.isReservedDomainTablePresent();
    page.clearSearch();
    page.txtSearchBox.sendKeys('ns1.fake.example');
    page.clickSearchButton();
    page.isHostTablePresent();
    page.clearSearch();
    done();
  });
});
