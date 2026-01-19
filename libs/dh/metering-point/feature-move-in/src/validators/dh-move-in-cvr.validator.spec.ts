import { FormControl } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@energinet-datahub/dh/shared/environments', () => ({
  environment: { production: false, authDisabled: false, mocked: false },
}));

import { dhMoveInCvrValidator } from './dh-move-in-cvr.validator';

describe('dhMoveInCvrValidator', () => {
  it('allows 11111111 in non-production', () => {
    const control = new FormControl('11111111');
    const validator = dhMoveInCvrValidator();
    expect(validator(control)).toBeNull();
  });

  it('allows 22222222 in non-production', () => {
    const control = new FormControl('22222222');
    const validator = dhMoveInCvrValidator();
    expect(validator(control)).toBeNull();
  });

  it('rejects invalid CVR values that are not allowlisted', () => {
    const control = new FormControl('12345678');
    const validator = dhMoveInCvrValidator();
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });
});
