// Copyright 2017 The Nomulus Authors. All Rights Reserved.
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

// utils for expected conditions
import { browser, protractor } from 'protractor';
import { Address } from './address';

const EC = protractor.ExpectedConditions;
const address = new Address();

export class Expected {

  // element is present on the DOM of a page and visible
  isVisible(options) {
    options = options || {};
    const e = options.e || '';
    if (e !== '') {
      browser.wait(EC.visibilityOf(e), 10 * 1000, 'Element should be visible within 10 seconds');
    }
  };

  // element is present on the DOM of a page and clickable
  isClickable(options) {
    options = options || {};
    const e = options.e || '';
    if (e !== '') {
      browser.wait(EC.elementToBeClickable(e), 10 * 1000, 'Element should be clickable within 10 seconds');
    }
  };

  // element is present on the DOM of a page and selectable
  isSelectable(options) {
    options = options || {};
    const e = options.e || '';
    if (e !== '') {
      browser.wait(EC.elementToBeSelected(e), 10 * 1000, 'Element should be clickable within 10 seconds');
    }
  };

  // a page is loaded. an element is present on the DOM of that page and visible
  renderPage(options) {
    options = options || {};
    const e = options.e || '';
    const pathOptions = options.path || '';
    const uri = address.getBaseUrl() + pathOptions;

    if (e !== '' && uri !== '') {
      // keeping this for debugging
      const urlChanged = function () {
        return browser.getCurrentUrl().then(function (urlParam) {
          return urlParam === uri;
        });
      };

      // let condition = EC.and(urlChanged, (EC.visibilityOf(e)));
      const condition = EC.visibilityOf(e);
      browser.get(uri);
      browser.wait(condition, 10 * 1000, 'Element should be visible within 10 seconds');
    }
  };
}

