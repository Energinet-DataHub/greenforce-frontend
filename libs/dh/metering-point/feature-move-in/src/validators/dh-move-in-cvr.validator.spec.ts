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
﻿import { FormControl } from '@angular/forms';
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
