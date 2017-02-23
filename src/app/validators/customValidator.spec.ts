import {FormControl } from '@angular/forms';
import {CustomValidator} from "./customValidator";

describe('customValidator Test', () => {

  xit('should validate ipV6 address in not valid', () => {
    expect(CustomValidator.validateMoney(1,2)).toEqual({
      'validateipV6RegEx': {'valid': false}
    });
  });

  xit('should validate ipV6 address with null response', () => {
    expect(CustomValidator.validateMoney(1,3)).toEqual(null);
  });

  it('should validate ipV6 address in not valid', () => {
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
