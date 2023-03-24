import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WattStepperStepComponent } from './watt-stepper-step.component';
import { WattIconModule } from '../../foundations/icon/icon.module';
import { CommonModule } from '@angular/common';
import { CdkStepper, StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { PushModule } from '@rx-angular/template/push';
import { from, map, Observable, of, startWith, withLatestFrom } from 'rxjs';
import { WattButtonModule } from '../button';
import { WattStepperButtonNextDirective } from './watt-stepper-button-next';
import { WattStepperButtonPreviousDirective } from './watt-stepper-button-previous';

@Component({
  selector: 'watt-stepper',
  standalone: true,
  templateUrl: './watt-stepper.component.html',
  styleUrls: ['./watt-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    WattStepperStepComponent,
    MatStepperModule,
    CommonModule,
    WattIconModule,
    WattButtonModule,
    WattStepperButtonNextDirective,
    WattStepperButtonPreviousDirective,
    PushModule,
  ],
  providers: [
    { provide: CdkStepper, useExisting: WattStepperComponent },
    { provide: MatStepper, useExisting: WattStepperComponent },
  ],
})
export class WattStepperComponent extends MatStepper implements AfterViewInit {
  @Output() completed = new EventEmitter<void>();

  @ContentChildren(WattStepperStepComponent, { descendants: true })
  override _steps!: QueryList<WattStepperStepComponent>;

  override readonly steps!: QueryList<WattStepperStepComponent>;

  @ViewChild(MatStepper) stepper!: MatStepper;

  selectedIndexChanged$!: Observable<StepperSelectionEvent>;
  onFirstStep$!: Observable<boolean>;
  onLastStep$!: Observable<boolean>;

  ngAfterViewInit(): void {
    this.selectedIndexChanged$ = from(this.stepper.selectionChange);
    this.onLastStep$ = this.selectedIndexChanged$.pipe(
      withLatestFrom(of(this.steps)),
      map(([index, steps]) => index.selectedIndex === steps.length - 1),
      startWith(false)
    );
    this.onFirstStep$ = this.selectedIndexChanged$.pipe(
      map((index) => index.selectedIndex > 0),
      startWith(false)
    );
  }

  next(): void {
    this.stepper.next();
  }

  previous(): void {
    this.stepper.previous();
  }

  complete(): void {
    this.completed.emit();
  }
}

export const WATT_STEPPER = [WattStepperComponent, WattStepperStepComponent];
