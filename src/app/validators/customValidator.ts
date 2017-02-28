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

import {ValidatorFn, AbstractControl, FormControl} from '@angular/forms';

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export class CustomValidator {

  /**
   * Validator that requires controls to have a Money value greater than minAmount and less than maxAmount.
   *
   * @param minAmount
   * @param maxAmount
   * @returns {(control:AbstractControl)=>{[p: string]: any}}
   */
  static validateMoney(minAmount: number, maxAmount: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      if (control.value < minAmount) {
        return {'MinimumAmount': {'requiredAmount': minAmount, 'actualAmount': control.value}};
      } else if (control.value > maxAmount) {
        return {'MaximumAmount': {'requiredAmount': maxAmount, 'actualAmount': control.value}};
      }
      return null;
    };
  }

  /**
   * Validator that requires controls to have a valid email address.
   *
   * @param control
   * @returns {any}
   */
  static validateEmailAddress(control: FormControl) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {validateEmailAddress: {
        valid: false}
      };
    }
    return null;
  }

  /**
   * Validator that requires controls to have a valid ipV4RegEx.
   *
   * @param control
   * @returns {any}
   */
  static validateipV4RegEx(control: FormControl) {
    const v4RegEx = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!v4RegEx.test(control.value)) {
      return {validateipV4RegEx: {
        valid: false}
      };
    }
    return null;
  }

  /**
   * Validator that requires controls to have a valid ipV6RegEx.
   *
   * @param control
   * @returns {any}
   */
  static validateipV6RegEx(control: FormControl) {
    const v6RegEx = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/;
    if (!v6RegEx.test(control.value)) {
      return {validateipV6RegEx: {
        valid: false}
      };
    }
    return null;
  }
}
