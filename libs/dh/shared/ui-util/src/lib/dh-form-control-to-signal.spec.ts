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
import { FormControl } from '@angular/forms';
import { signal } from '@angular/core';

import { dhFormControlToSignal } from './dh-form-control-to-signal';

describe('dhFormControlToSignal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create a writable signal with the initial FormControl value', () => {
    TestBed.runInInjectionContext(() => {
      const formControl = new FormControl('initial value');
      const signalValue = dhFormControlToSignal(formControl);

      expect(signalValue()).toBe('initial value');
    });
  });

  it('should update signal when FormControl value changes', () => {
    TestBed.runInInjectionContext(async () => {
      const formControl = new FormControl('initial');
      const signalValue = dhFormControlToSignal(formControl);

      formControl.setValue('updated');
      TestBed.tick();

      await expect.poll(() => signalValue()).toBe('updated');
    });
  });

  it('should update FormControl when signal value changes', () => {
    TestBed.runInInjectionContext(() => {
      const formControl = new FormControl('initial');
      const signalValue = dhFormControlToSignal(formControl);

      signalValue.set('new value');
      TestBed.tick();

      expect(formControl.value).toBe('new value');
    });
  });

  it('should handle numeric values', () => {
    TestBed.runInInjectionContext(async () => {
      const formControl = new FormControl<number>(42);
      const signalValue = dhFormControlToSignal(formControl);

      expect(signalValue()).toBe(42);

      formControl.setValue(100);
      TestBed.tick();

      await expect.poll(() => signalValue()).toBe(100);
    });
  });

  it('should handle null values', () => {
    TestBed.runInInjectionContext(async () => {
      const formControl = new FormControl<string | null>(null);
      const signalValue = dhFormControlToSignal(formControl);

      expect(signalValue()).toBeNull();

      formControl.setValue('not null');
      TestBed.tick();

      await expect.poll(() => signalValue()).toBe('not null');
    });
  });

  it('should accept a FormControl factory function', () => {
    TestBed.runInInjectionContext(() => {
      const formControlSignal = signal(new FormControl('from factory'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      expect(signalValue()).toBe('from factory');
    });
  });

  it('should update signal when FormControl from factory changes', () => {
    TestBed.runInInjectionContext(async () => {
      const formControlSignal = signal(new FormControl('initial'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      formControlSignal().setValue('updated from factory');
      TestBed.tick();

      await expect.poll(() => signalValue()).toBe('updated from factory');
    });
  });

  it('should update FormControl from factory when signal changes', () => {
    TestBed.runInInjectionContext(() => {
      const formControlSignal = signal(new FormControl('initial'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      signalValue.set('signal update');
      TestBed.tick();

      expect(formControlSignal().value).toBe('signal update');
    });
  });

  it('should not update FormControl if signal value equals current control value', () => {
    TestBed.runInInjectionContext(() => {
      const formControl = new FormControl('same value');
      const signalValue = dhFormControlToSignal(formControl);

      const setValueSpy = vi.spyOn(formControl, 'setValue');

      signalValue.set('same value');
      TestBed.tick();

      expect(setValueSpy).not.toHaveBeenCalled();
    });
  });

  it('should call updateValueAndValidity when signal updates control', () => {
    TestBed.runInInjectionContext(() => {
      const formControl = new FormControl('initial');
      const signalValue = dhFormControlToSignal(formControl);

      const updateSpy = vi.spyOn(formControl, 'updateValueAndValidity');

      signalValue.set('trigger update');
      TestBed.tick();

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  it('should handle complex object values', () => {
    TestBed.runInInjectionContext(async () => {
      const initialValue = { name: 'John', age: 30 };
      const formControl = new FormControl(initialValue);
      const signalValue = dhFormControlToSignal(formControl);

      expect(signalValue()).toEqual(initialValue);

      const newValue = { name: 'Jane', age: 25 };
      formControl.setValue(newValue);
      TestBed.tick();

      await expect.poll(() => signalValue()).toEqual(newValue);
    });
  });

  it('should synchronize bidirectionally between control and signal', () => {
    TestBed.runInInjectionContext(async () => {
      const formControl = new FormControl('start');
      const signalValue = dhFormControlToSignal(formControl);

      formControl.setValue('from control');
      TestBed.tick();
      await expect.poll(() => signalValue()).toBe('from control');

      signalValue.set('from signal');
      TestBed.tick();
      expect(formControl.value).toBe('from signal');

      formControl.setValue('back to control');
      TestBed.tick();
      await expect.poll(() => signalValue()).toBe('back to control');
    });
  });

  it('should update signal value when FormControl reference changes', () => {
    TestBed.runInInjectionContext(() => {
      const controlA = new FormControl('value A');
      const controlB = new FormControl('value B');
      const controlSignal = signal(controlA);

      const value = dhFormControlToSignal(() => controlSignal());

      expect(value()).toBe('value A');

      controlSignal.set(controlB);
      TestBed.flushEffects();

      expect(value()).toBe('value B');
    });
  });
});
