import { FormControl } from '@angular/forms';
import { nextHourOrLaterValidator } from './next-hour-or-later-validator';

describe('nextHourOrLaterValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', nextHourOrLaterValidator());
  });

  it('should return null if the control value is empty', () => {
    control.setValue('');

    expect(control.valid).toBe(true);
  });

  it('should return null if the control value is at least one hour in the future', () => {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

    control.setValue(nextHour.toISOString());

    expect(control.valid).toBe(true);
  });

  it('should set validation errors if the control value is less than one hour in the future', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1000 * 60 * 59);

    control.setValue(past.toISOString());

    expect(control.valid).toBe(false);
    expect(control.hasError('nextHourOrLater')).toBe(true);
  });

  it('should not validate disabled controls', () => {
    control.disable();
    expect(control.errors).toBe(null);
  });
});
