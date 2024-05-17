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
import {
  AfterViewInit,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { CdkStepper, StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RxPush } from '@rx-angular/template/push';
import { from, map, Observable, of, startWith, withLatestFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { WattStepperStepComponent } from './watt-stepper-step.component';

@Component({
  selector: 'watt-stepper',
  standalone: true,
  templateUrl: './watt-stepper.component.html',
  styleUrls: ['./watt-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    RxPush,
    MatStepperModule,

    WattStepperStepComponent,
    WattIconComponent,
    WattButtonComponent,
  ],
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
  override _steps!: QueryList<WattStepperStepComponent>;

  override readonly steps!: QueryList<WattStepperStepComponent>;

  @ViewChild(MatStepper) stepper!: MatStepper;

  selectedIndexChanged$!: Observable<StepperSelectionEvent>;
  onFirstStep$!: Observable<boolean>;
  onLastStep$!: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  override ngAfterViewInit(): void {
    this.selectedIndexChanged$ = from(this.stepper.selectionChange);
    this.onLastStep$ = this.selectedIndexChanged$.pipe(
      withLatestFrom(of(this.steps)),
      map(([index, steps]) => index.selectedIndex === steps.filter((x) => x.enabled).length - 1),
      startWith(false)
    );
    this.onFirstStep$ = this.selectedIndexChanged$.pipe(
      map((index) => index.selectedIndex === 0),
      startWith(true)
    );

    // Emit entering and leaving events
    this.selectedIndexChanged$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((change) => {
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
