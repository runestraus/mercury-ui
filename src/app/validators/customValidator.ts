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
        return {'minAmount': {'requiredAmount': minAmount, 'actualAmount': control.value}};
      } else if (control.value > maxAmount) {
        return {'maxAmount': {'requiredAmount': maxAmount, 'actualAmount': control.value}};
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
  static validateEmailAddress(control: FormControl): ValidationResult {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
    return null;
  }

  /**
   * Validator that requires controls to have a valid ipV4RegEx.
   *
   * @param control
   * @returns {any}
   */
  static validateipV4RegEx(control: FormControl): ValidationResult {
    const v4RegEx = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!v4RegEx.test(control.value)) {
      return {invalidipV4RegEx: true};
    }
    return null;
  }

  /**
   * Validator that requires controls to have a valid ipV6RegEx.
   *
   * @param control
   * @returns {any}
   */
  static validateipV6RegEx(control: FormControl): ValidationResult {
    const v6RegEx = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/;
    if (!v6RegEx.test(control.value)) {
      return {invalidipV6RegEx: true};
    }
    return null;
  }
}

interface ValidationResult {
  [key: string]: boolean;
}
