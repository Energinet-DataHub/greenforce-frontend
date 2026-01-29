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
import { Injector } from '@angular/core';

import {
  DhAppEnvironment,
  dhAppEnvironmentToken,
  type DhAppEnvironmentConfig,
} from '@energinet-datahub/dh/shared/environments';

import { dhMoveInCvrValidator } from './dh-move-in-cvr.validator';

function createAppEnvInjector(current: DhAppEnvironment): Injector {
  const config: DhAppEnvironmentConfig = {
    current,
    applicationInsights: { connectionString: '' },
  };

  return Injector.create({
    providers: [{ provide: dhAppEnvironmentToken, useValue: config }],
  });
}

describe('dhMoveInCvrValidator', () => {
  it('allows 11111111 in non-prod/non-preprod', () => {
    const injector = createAppEnvInjector(DhAppEnvironment.test_001);
    const validator = dhMoveInCvrValidator(injector);

    const control = new FormControl('11111111');
    expect(validator(control)).toBeNull();
  });

  it('allows 22222222 in non-prod/non-preprod', () => {
    const injector = createAppEnvInjector(DhAppEnvironment.dev_001);
    const validator = dhMoveInCvrValidator(injector);

    const control = new FormControl('22222222');
    expect(validator(control)).toBeNull();
  });

  it('rejects invalid CVR values that are not allowlisted', () => {
    const injector = createAppEnvInjector(DhAppEnvironment.test_001);
    const validator = dhMoveInCvrValidator(injector);

    const control = new FormControl('12345678');
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });

  it('does NOT allow 11111111 in preprod', () => {
    const injector = createAppEnvInjector(DhAppEnvironment.preprod);
    const validator = dhMoveInCvrValidator(injector);

    const control = new FormControl('11111111');
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });

  it('does NOT allow 11111111 in prod', () => {
    const injector = createAppEnvInjector(DhAppEnvironment.prod);
    const validator = dhMoveInCvrValidator(injector);

    const control = new FormControl('11111111');
    expect(validator(control)).toEqual({ invalidCvrNumber: true });
  });
});
