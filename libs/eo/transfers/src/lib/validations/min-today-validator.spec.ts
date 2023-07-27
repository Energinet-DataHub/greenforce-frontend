import { FormControl, FormGroup } from '@angular/forms';
import { minTodayValidator } from './min-today-validator';

describe('minTodayValidator', () => {
  let formGroup: FormGroup | null = null;

  beforeEach(() => {
    formGroup = new FormGroup({
      date: new FormControl('', minTodayValidator()),
    });
  });

  it('should return null if the control value is empty', () => {
    if (formGroup) {
      formGroup.patchValue({
        date: '',
      });

      expect(formGroup.get('date')?.valid).toBe(true);
    }
  });

  it('should return null if the control date is today', () => {
    if (formGroup) {
      const today = new Date();
      formGroup.patchValue({
        date: today,
      });

      expect(formGroup.get('date')?.valid).toBe(true);
    }
  });

  it('should return null if the control date is in the future', () => {
    if (formGroup) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      formGroup.patchValue({
        date: tomorrow,
      });

      expect(formGroup.get('date')?.valid).toBe(true);
    }
  });

  it('should return an error if the control date is before today', () => {
    if (formGroup) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      formGroup.patchValue({
        date: yesterday,
      });

      expect(formGroup.get('date')?.hasError('minToday')).toBe(true);
    }
  });
});
