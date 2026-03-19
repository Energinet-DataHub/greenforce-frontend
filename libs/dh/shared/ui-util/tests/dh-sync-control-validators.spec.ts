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
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { signal } from '@angular/core';

import {
  dhSyncControlValidators,
  dhSwapControlValidators,
} from '../src/dh-sync-control-validators';

const minLengthValidator = Validators.minLength(3);

describe('dhSyncControlValidators', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should add validators when condition is true', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const condition = signal(true);
      dhSyncControlValidators(() => control, Validators.required, condition);
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(true);
    });
  });

  it('should remove validators when condition is false', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('', Validators.required);
      const condition = signal(false);
      dhSyncControlValidators(() => control, Validators.required, condition);
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(false);
    });
  });

  it('should react to condition changes', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const condition = signal(false);
      dhSyncControlValidators(() => control, Validators.required, condition);
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(false);

      condition.set(true);
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(true);

      condition.set(false);
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(false);
    });
  });

  it('should reset on deactivation when reset option is true', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('value');
      const condition = signal(true);
      dhSyncControlValidators(() => control, Validators.required, condition, { reset: true });
      TestBed.tick();

      condition.set(false);
      TestBed.tick();
      expect(control.value).toBeNull();
    });
  });
});

describe('dhSwapControlValidators', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should add active validators and remove inactive ones', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const conditionA = signal(true);
      const conditionB = signal(false);
      dhSwapControlValidators(
        () => control,
        [
          { validators: Validators.required, active: conditionA },
          { validators: minLengthValidator, active: conditionB },
        ]
      );
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(true);
      expect(control.hasValidator(minLengthValidator)).toBe(false);
    });
  });

  it('should swap validators when conditions change', () => {
    TestBed.runInInjectionContext(() => {
      const control = new FormControl('');
      const conditionA = signal(true);
      const conditionB = signal(false);
      dhSwapControlValidators(
        () => control,
        [
          { validators: Validators.required, active: conditionA },
          { validators: minLengthValidator, active: conditionB },
        ]
      );
      TestBed.tick();

      conditionA.set(false);
      conditionB.set(true);
      TestBed.tick();
      expect(control.hasValidator(Validators.required)).toBe(false);
      expect(control.hasValidator(minLengthValidator)).toBe(true);
    });
  });
});
