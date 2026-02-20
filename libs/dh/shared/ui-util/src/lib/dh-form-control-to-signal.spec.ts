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

  it('should set initial value when FormControl factory returns a new FormControl', () => {
    TestBed.runInInjectionContext(async () => {
      const formControlSignal = signal(new FormControl('first control'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      expect(signalValue()).toBe('first control');

      // Update the factory signal with a new FormControl that has a different initial value
      formControlSignal.set(new FormControl('second control'));
      TestBed.tick();

      // The signal should update to the initial value of the new FormControl
      await expect.poll(() => signalValue()).toBe('second control');
    });
  });

  it('should handle updating to a new FormControl with different initial value without triggering valueChanges', () => {
    TestBed.runInInjectionContext(async () => {
      // Start with a FormControl with value 'initial'
      const formControlSignal = signal(new FormControl('initial'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      expect(signalValue()).toBe('initial');

      // Change the signal value
      signalValue.set('modified');
      TestBed.tick();
      expect(formControlSignal().value).toBe('modified');

      // Now replace the FormControl entirely with a new one that has value 'brand new'
      // This new control's valueChanges hasn't been triggered yet
      const newControl = new FormControl('brand new');
      formControlSignal.set(newControl);
      TestBed.tick();

      // The signal should now reflect the initial value of the new FormControl
      await expect.poll(() => signalValue()).toBe('brand new');
      expect(newControl.value).toBe('brand new');
    });
  });

  it('should respect the initial value of a new FormControl when factory changes', () => {
    TestBed.runInInjectionContext(async () => {
      const formControlSignal = signal(new FormControl('first'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      // Change the signal to something else
      signalValue.set('updated first');
      TestBed.tick();

      // Replace with a completely new FormControl that has its own initial value
      const secondControl = new FormControl('second');
      formControlSignal.set(secondControl);
      TestBed.tick();

      // EXPECTED: The signal should adopt the new control's initial value
      // ACTUAL (BUG): The new control gets overwritten with the old signal value
      await expect.poll(() => signalValue()).toBe('second');
      
      // The new FormControl should maintain its initial value, not be overwritten
      expect(secondControl.value).toBe('second');
    });
  });

  it('should demonstrate the bug: new FormControl initial value is overwritten', () => {
    TestBed.runInInjectionContext(() => {
      const formControlSignal = signal(new FormControl('first'));
      const signalValue = dhFormControlToSignal(() => formControlSignal());

      expect(signalValue()).toBe('first');
      expect(formControlSignal().value).toBe('first');

      // Update the signal value
      signalValue.set('changed');
      TestBed.tick();
      expect(formControlSignal().value).toBe('changed');

      // Create a new FormControl with a different initial value
      const newControl = new FormControl('new initial value');
      expect(newControl.value).toBe('new initial value'); // Sanity check

      // Replace the FormControl in the factory
      formControlSignal.set(newControl);
      TestBed.tick();

      // BUG: The new control's initial value gets overwritten
      // Expected: newControl.value should be 'new initial value'
      // Actual: newControl.value becomes 'changed' (the old signal value)
      console.log('Signal value:', signalValue());
      console.log('New control value:', newControl.value);
      
      // This is the bug: the new control should keep its initial value
      expect(newControl.value).toBe('new initial value');
      expect(signalValue()).toBe('new initial value');
    });
  });
});
