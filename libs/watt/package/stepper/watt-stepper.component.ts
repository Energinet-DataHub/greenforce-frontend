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
  AfterViewInit,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { from, Observable } from 'rxjs';
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
export class WattStepperComponent extends MatStepper implements AfterViewInit {
  @Output() completed = new EventEmitter<void>();
  @Input() isCompleting = false;

  @ContentChildren(WattStepperStepComponent, { descendants: true })
  declare _steps: QueryList<WattStepperStepComponent>;

  @ViewChild(MatStepper) stepper!: MatStepper;

  selectedIndexChanged$!: Observable<StepperSelectionEvent>;
  onFirstStep = signal(true);
  onLastStep = signal(false);

  private destroyRef = inject(DestroyRef);

  override reset() {
    this.stepper.reset();
  }

  override ngAfterViewInit(): void {
    this.selectedIndexChanged$ = from(this.stepper.selectionChange);

    // Subscribe to selection changes and update signals
    this.selectedIndexChanged$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((change) => {
      // Update onFirstStep signal
      this.onFirstStep.set(change.selectedIndex === 0);

      // Update onLastStep signal
      const enabledSteps = this._steps.filter((x) => x.enabled());
      this.onLastStep.set(change.selectedIndex === enabledSteps.length - 1);

      // Emit entering and leaving events
      this._steps.get(change.selectedIndex)?.entering.emit(change.selectedStep);
      this._steps.get(change.previouslySelectedIndex)?.leaving.emit(change.previouslySelectedStep);
    });
  }

  nextStep(step: WattStepperStepComponent): void {
    step.next.emit();
    this.stepper.selected?.stepControl?.markAllAsTouched();
    this.stepper.next();
  }

  previousStep(): void {
    this.stepper.previous();
  }

  complete(): void {
    this.stepper.selected?.stepControl?.markAllAsTouched();
    this.completed.emit();
  }
}

export const WATT_STEPPER = [WattStepperComponent, WattStepperStepComponent];
