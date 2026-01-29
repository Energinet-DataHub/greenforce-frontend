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
  effect,
  input,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
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
  private stepperSelectionChange = toSignal(this.selectionChange.asObservable());

  completed = output<void>();
  isCompleting = input(false);
  wattSteps = contentChildren(WattStepperStepComponent, { descendants: true });
  stepper = viewChild.required(MatStepper);
  onFirstStep = computed(() => (this.stepperSelectionChange()?.selectedIndex ?? 0) === 0);
  onLastStep = computed(
    () =>
      (this.stepperSelectionChange()?.selectedIndex ?? 0) ===
      this.wattSteps()?.filter((x) => x.enabled()).length - 1
  );

  constructor() {
    super();

    effect(() => {
      const change = this.stepperSelectionChange();
      if (change) {
        this.wattSteps()[change.selectedIndex]?.entering.emit(change.selectedStep);
        this.wattSteps()[change.previouslySelectedIndex]?.leaving.emit(
          change.previouslySelectedStep
        );
      }
    });
  }

  override reset() {
    this.stepper().reset();
  }

  nextStep(step: WattStepperStepComponent): void {
    step.next.emit();
    this.stepper().selected?.stepControl?.markAllAsTouched();
    this.stepper().next();
  }

  previousStep(): void {
    this.stepper().previous();
  }

  complete(): void {
    this.stepper().selected?.stepControl?.markAllAsTouched();
    this.completed.emit();
  }
}

export const WATT_STEPPER = [WattStepperComponent, WattStepperStepComponent];
