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
import {
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';

import { WattStepperStepComponent } from './watt-stepper-step.component';

@Component({
  selector: 'watt-stepper',
  templateUrl: './watt-stepper.component.html',
  styleUrls: ['./watt-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [NgTemplateOutlet, MatStepperModule, WattIconComponent, WattButtonComponent],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true, displayDefaultIndicatorType: false },
    },
    { provide: CdkStepper, useExisting: WattStepperComponent },
    { provide: MatStepper, useExisting: WattStepperComponent },
  ],
})
export class WattStepperComponent extends MatStepper {
  completed = output<void>();
  isCompleting = input(false);

  private _wattSteps = contentChildren(WattStepperStepComponent, { descendants: true });
  stepper = viewChild(MatStepper);

  private _currentStepIndex = signal(0);
  private _previousStepIndex = signal(0);

  onFirstStep = computed(() => this._currentStepIndex() === 0);
  onLastStep = computed(() => {
    const steps = this._wattSteps();
    const enabledSteps = steps ? [...steps].filter(x => x.enabled()) : [];
    return this._currentStepIndex() === enabledSteps.length - 1;
  });

  override get selectedIndex(): number {
    return this._currentStepIndex();
  }

  override set selectedIndex(value: number) {
    this._currentStepIndex.set(value);
  }

  private destroyRef = inject(DestroyRef);

  constructor() {
    super();

    effect(() => {
      const currentIndex = this._currentStepIndex();
      const previousIndex = this._previousStepIndex();
      const wattSteps = this._wattSteps();
      const stepperInstance = this.stepper();

      if (wattSteps && stepperInstance) {
        const currentStep = stepperInstance.steps.get(currentIndex);
        const previousStep = stepperInstance.steps.get(previousIndex);
        const wattStepsArray = [...wattSteps];

        if (currentStep && wattStepsArray[currentIndex]) {
          wattStepsArray[currentIndex].entering.emit(currentStep);
        }
        if (previousStep && wattStepsArray[previousIndex]) {
          wattStepsArray[previousIndex].leaving.emit(previousStep);
        }

        stepperInstance.selectionChange.pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe((event: StepperSelectionEvent) => {
          this._previousStepIndex.set(event.previouslySelectedIndex);
          this._currentStepIndex.set(event.selectedIndex);
        });
      }
    });
  }

  override reset() {
    this.stepper()?.reset();
    this._currentStepIndex.set(0);
    this._previousStepIndex.set(0);
  }


  nextStep(step: WattStepperStepComponent): void {
    step.next.emit();
    this.stepper()?.selected?.stepControl?.markAllAsTouched();
    this.stepper()?.next();
  }

  previousStep(): void {
    this.stepper()?.previous();
  }

  complete(): void {
    this.stepper()?.selected?.stepControl?.markAllAsTouched();
    this.completed.emit();
  }
}

export const WATT_STEPPER = [WattStepperComponent, WattStepperStepComponent];
