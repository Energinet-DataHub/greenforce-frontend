import { AbstractControl, FormControl } from '@angular/forms';

import { dhGlnOrEicValidator } from './dh-gln-or-eic.validator';

describe(dhGlnOrEicValidator, () => {
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl('', dhGlnOrEicValidator());
  });

  it('should return null when the value is a valid GLN', () => {
    control.setValue('1234567890123');

    expect(control.errors).toBeNull();
  });

  it('should return null when the value is a valid EIC', () => {
    control.setValue('a1b-2C3D4E5F6G7H');

    expect(control.errors).toBeNull();
  });

  it('should return an error when the value is not a valid GLN or EIC', () => {
    const invalidGln = '123456789';
    control.setValue(invalidGln);

    expect(control.errors).toEqual({ invalidGlnOrEic: true });

    const invalidEic = 'A1B2C3D4E5F6G7H8I9';
    control.setValue(invalidEic);

    expect(control.errors).toEqual({ invalidGlnOrEic: true });
  });
});
