import { FormGroup, FormControl } from '@angular/forms';
import { endDateMustBeLaterThanStartDateValidator } from './end-date-must-be-later-than-start-date-validator';

describe('endDateMustBeLaterThanStartDateValidator', () => {
  let formGroup: FormGroup | null = null;
  const startDate = new Date('2021-01-01');
  const endDate = new Date('2021-01-02');

  beforeEach(() => {
    formGroup = new FormGroup(
      {
        startDate: new FormControl(),
        endDate: new FormControl(),
      },
      { validators: endDateMustBeLaterThanStartDateValidator() }
    );
  });

  it('should return null if endDate is later than startDate', () => {
    if (formGroup) {
      formGroup.patchValue({
        startDate,
        endDate,
      });

      expect(formGroup.valid).toBe(true);
    }
  });

  it('should set validation errors if endDate is earlier than startDate', () => {
    if (formGroup) {
      formGroup.patchValue({
        startDate: endDate,
        endDate: startDate,
      });

      expect(formGroup.valid).toBe(false);
      expect(formGroup.get('endDate')?.hasError('endDateMustBeLaterThanStartDate')).toBe(true);
    }
  });

  it('should not set validation errors if either startDate or endDate is not set', () => {
    if (formGroup) {
      formGroup.patchValue({
        startDate,
      });

      expect(formGroup.valid).toBe(true);

      formGroup.patchValue({
        endDate,
      });

      expect(formGroup.valid).toBe(true);
    }
  });
});
