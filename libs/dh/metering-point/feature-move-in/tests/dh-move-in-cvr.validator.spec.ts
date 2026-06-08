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
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { DhAppEnvironment, dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { dhMoveInCvrValidator } from '../src/validators/dh-move-in-cvr.validator';

function createValidator(env: DhAppEnvironment) {
  TestBed.configureTestingModule({
    providers: [{ provide: dhAppEnvironmentToken, useValue: { current: env } }],
  });

  return TestBed.runInInjectionContext(() =>
    dhMoveInCvrValidator(TestBed.inject(Injector))
  );
}

describe('dhMoveInCvrValidator', () => {
  describe('non-production environments (local, dev, test)', () => {
    const validator = createValidator(DhAppEnvironment.local);

    it('allows test CVR 11111111', () => {
      expect(validator(new FormControl('11111111'))).toBeNull();
    });

    it('allows test CVR 22222222', () => {
      expect(validator(new FormControl('22222222'))).toBeNull();
    });

    it('allows test CVR 33333333', () => {
      expect(validator(new FormControl('33333333'))).toBeNull();
    });
  });

  describe('restricted environments (prod, preprod)', () => {
    it('allows test CVR 11111111 in prod', () => {
      const validator = createValidator(DhAppEnvironment.prod);
      expect(validator(new FormControl('11111111'))).toBeNull();
    });

    it('rejects test CVR 22222222 in prod', () => {
      const validator = createValidator(DhAppEnvironment.prod);
      expect(validator(new FormControl('22222222'))).toEqual({ invalidCvrNumber: true });
    });

    it('rejects test CVR 33333333 in prod', () => {
      const validator = createValidator(DhAppEnvironment.prod);
      expect(validator(new FormControl('33333333'))).toEqual({ invalidCvrNumber: true });
    });

    it('allows test CVR 11111111 in preprod', () => {
      const validator = createValidator(DhAppEnvironment.preprod);
      expect(validator(new FormControl('11111111'))).toBeNull();
    });

    it('rejects test CVR 22222222 in preprod', () => {
      const validator = createValidator(DhAppEnvironment.preprod);
      expect(validator(new FormControl('22222222'))).toEqual({ invalidCvrNumber: true });
    });

    it('rejects test CVR 33333333 in preprod', () => {
      const validator = createValidator(DhAppEnvironment.preprod);
      expect(validator(new FormControl('33333333'))).toEqual({ invalidCvrNumber: true });
    });
  });

  describe('base validator behaviour (any environment)', () => {
    const validator = createValidator(DhAppEnvironment.local);

    it('allows a valid CVR number', () => {
      // 12345674: weighted sum = 106, mod 11 = 7, check digit = 4 ✓
      expect(validator(new FormControl('12345674'))).toBeNull();
    });

    it('allows an empty value', () => {
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('rejects a CVR with an invalid checksum', () => {
      // 12345678: expected check digit is 4, not 8
      expect(validator(new FormControl('12345678'))).toEqual({ invalidCvrNumber: true });
    });

    it('rejects a CVR that is too short', () => {
      expect(validator(new FormControl('1234567'))).toEqual({ invalidCvrNumber: true });
    });

    it('rejects a CVR that is too long', () => {
      expect(validator(new FormControl('123456789'))).toEqual({ invalidCvrNumber: true });
    });
  });
});

