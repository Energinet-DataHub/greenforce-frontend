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

import { WattStepperStepComponent } from './watt-stepper-step.component';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattButtonComponent } from '../button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
