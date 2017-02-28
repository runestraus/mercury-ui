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

import {FormControl } from '@angular/forms';
import {CustomValidator} from './customValidator';

describe('customValidator Test', () => {

  it('should validate Money maximum amount is not valid', () => {
    expect(CustomValidator.validateMoney(1, 2)(new FormControl('3'))).toEqual(
      { MaximumAmount: Object({ requiredAmount: 2, actualAmount: '3' }) }
    );
  });

  it('should validate Money minimum amount is not valid', () => {
    expect(CustomValidator.validateMoney(2, 4)(new FormControl('1'))).toEqual(
      { MinimumAmount: Object({ requiredAmount: 2, actualAmount: '1' }) }
    );
  });

  it('should validate Money with null response', () => {
    expect(CustomValidator.validateMoney(1, 3)(new FormControl('2'))).toEqual(null);
  });

  it('should validate ipV6 address is not valid', () => {
    expect(CustomValidator.validateipV6RegEx(new FormControl('1722.162.2542.12'))).toEqual({
      'validateipV6RegEx': {'valid': false}
    });
  });

  it('should validate ipV6 address with null response', () => {
    expect(CustomValidator.validateipV6RegEx(new FormControl('0:0:0:0:0:0:0:1'))).toEqual(null);
  });

  it('should validate ipV4 address is not valid', () => {
    expect(CustomValidator.validateipV4RegEx(new FormControl('1722.162.2542.12'))).toEqual({
      'validateipV4RegEx': {'valid': false}
    });
  });

  it('should validate ipV4 address with null response', () => {
    expect(CustomValidator.validateipV4RegEx(new FormControl('172.16.254.1'))).toEqual(null);
  });

  it('should validate email is not valid', () => {
    expect(CustomValidator.validateEmailAddress(new FormControl('123456'))).toEqual({
      'validateEmailAddress': {'valid': false}
    });
  });

  it('should validate email is valid with null response', () => {
    expect(CustomValidator.validateEmailAddress(new FormControl('test@test.com'))).toEqual(null);
  });
});
