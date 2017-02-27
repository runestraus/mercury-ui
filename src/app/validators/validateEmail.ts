import {FormControl, Validator} from '@angular/forms';

export class ValidateEmail implements Validator{

  validate(control: FormControl) : ValidationResult  {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }
}
interface ValidationResult {
  [key: string]: boolean;
}

