//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import {
  customerCprValidators,
  isCustomerCprMasked,
  shouldRequireCustomerCpr,
} from './customer-cpr-field';

describe('isCustomerCprMasked', () => {
  it('returns true when masking is enabled and an existing customer ID is available', () => {
    expect(isCustomerCprMasked(true, 'customer-id')).toBe(true);
  });

  it.each([
    { maskCprFields: false, customerId: 'customer-id' },
    { maskCprFields: true, customerId: null },
    { maskCprFields: false, customerId: null },
  ])('returns false when CPR cannot be masked (%o)', ({ maskCprFields, customerId }) => {
    expect(isCustomerCprMasked(maskCprFields, customerId)).toBe(false);
  });
});

describe('customerCprValidators', () => {
  it('does not require an empty CPR when the field is masked, even if it is otherwise required', () => {
    const control = new FormControl<string | null>(
      null,
      customerCprValidators({ requiredWhenUnmasked: true, isMasked: true })
    );

    expect(control.hasError('required')).toBe(false);
  });

  it('requires CPR when the field is not masked and CPR is mandatory', () => {
    const control = new FormControl<string | null>(
      null,
      customerCprValidators({ requiredWhenUnmasked: true, isMasked: false })
    );

    expect(control.hasError('required')).toBe(true);
  });

  it('still validates CPR format when the field is not required', () => {
    const control = new FormControl<string | null>(
      'not-a-cpr',
      customerCprValidators({ requiredWhenUnmasked: false, isMasked: false })
    );

    expect(control.hasError('containsLetters')).toBe(true);
  });
});

describe('shouldRequireCustomerCpr', () => {
  it('returns false when the CPR field is masked, even if it would otherwise be required', () => {
    expect(shouldRequireCustomerCpr({ requiredWhenUnmasked: true, isMasked: true })).toBe(false);
  });

  it('returns true when the CPR field is not masked and would otherwise be required', () => {
    expect(shouldRequireCustomerCpr({ requiredWhenUnmasked: true, isMasked: false })).toBe(true);
  });

  it('returns false when the CPR field is not otherwise required', () => {
    expect(shouldRequireCustomerCpr({ requiredWhenUnmasked: false, isMasked: false })).toBe(false);
  });
});
