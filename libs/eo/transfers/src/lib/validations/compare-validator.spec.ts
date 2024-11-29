import { FormControl, FormGroup } from '@angular/forms';
import { compareValidator } from './compare-validator';

describe('compareValidator', () => {
  let formGroup: FormGroup | null = null;
  const compareValue = '11223344';

  beforeEach(() => {
    formGroup = new FormGroup({
      receiver: new FormControl('', compareValidator(compareValue, 'compare')),
    });
  });

  it('should return null if the control value matches the compare value', () => {
    if (formGroup) {
      formGroup.patchValue({
        receiver: compareValue.split('').reverse().join(''),
      });

      const control = formGroup.get('receiver');
      expect(control).not.toBeNull();
      expect(control?.hasError('compare')).toBe(false);
    }
  });

  it('should return an error if the control value does not match the compare value', () => {
    if (formGroup) {
      formGroup.patchValue({
        receiver: compareValue,
      });

      const control = formGroup.get('receiver');
      expect(control).not.toBeNull();
      expect(control?.hasError('compare')).toBe(true);
    }
  });
});
