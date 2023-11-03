import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { dhCvrValidator } from './dh-cvr.validator';

describe('dhCvrValidator', () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null if control value is empty', () => {
    expect(dhCvrValidator()(control)).toBeNull();
  });

  it('should return null if control value is a valid Danish organization number', () => {
    control.setValue('28980671');
    expect(dhCvrValidator()(control)).toBeNull();
  });

  it('should return an error object if control value is an invalid Danish organization number', () => {
    control.setValue('12345679');
    const expectedError: ValidationErrors = { invalidCvrNumber: true };
    expect(dhCvrValidator()(control)).toEqual(expectedError);
  });
});
