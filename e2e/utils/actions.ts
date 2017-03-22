// Copyright 2017 The Nomulus Authors. All Rights Reserved.
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

// e = element, a = action, and d = data

import { browser } from 'protractor';
import { Expected } from './expected';

const expected = new Expected();

export class Actions {

  /**
   * Perform action on element with data.
   *
   * @param options
   */
  set(options) {
    options = options || {};
    // element
    const e = options.e || '';
    // action
    const a = options.a || '';
    // data
    const d = options.d || '';

    if (e !== '') {
      switch (a) {
        case 'click':
          expected.isClickable({e: e});
          e.click();
          break;
        case 'enter':
          expected.isVisible({e: e});
          e.clear();
          e.sendKeys(d);
          break;
        case 'select':
          expected.isVisible({e: e});
          e.click();
          e.$('[value="' + d + '"]').click();
          browser.actions().mouseDown().mouseUp().perform();
          break;
      }
    }
  };

  /**
   * check if element is visible and then return text or attribute
   * @param options
   * @returns {any}
   */
  get(options) {
    options = options || {};
    const e = options.e || '';
    const a = options.a || '';
    const d = options.d || '';

    if (e !== '') {
      switch (a) {
        case 'text':
          expected.isVisible({e: e});
          return e.getText();
        case 'attribute':
          expected.isVisible({e: e});
          return e.getAttribute(d);
      }
    }
  };

  /**
   * Check if element is visible.
   * @param options
   * @returns {any}
   */
  is(options) {
    options = options || {};
    const e = options.e || '';
    const a = options.a || '';

    if (e !== '') {
      switch (a) {
        case 'shown':
          expected.isVisible({e: e});
          return e.isDisplayed();
      }
    }
  };
}
