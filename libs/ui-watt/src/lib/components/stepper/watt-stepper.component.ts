import { AfterViewInit, Component, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WattIconModule } from '../../foundations/icon/icon.module';
import { WattStepperStepComponent } from './watt-stepper-step.component';
import { WattStepperButtonNextDirective } from './watt-stepper-button-next';
import { WattStepperButtonPreviousDirective } from './watt-stepper-button-previous';
import { CommonModule } from '@angular/common';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { BehaviorSubject, from, fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'watt-stepper',
  standalone: true,
  templateUrl: './watt-stepper.component.html',
  styleUrls: ['./watt-stepper.component.scss'],
  imports: [
    WattStepperStepComponent,
    WattStepperButtonNextDirective,
    WattStepperButtonPreviousDirective,
    MatStepperModule,
    WattIconModule,
    CommonModule,
  ],
})
export class WattStepperComponent implements AfterViewInit {
  @ContentChildren(WattStepperStepComponent)
  public readonly stepElements: WattStepperStepComponent[] = [];
  @ViewChild(MatStepper) stepper!: MatStepper;

  selectedIndexChanged$: Observable<StepperSelectionEvent> | null = null;

  ngAfterViewInit(): void {
    this.selectedIndexChanged$ = from(this.stepper.selectionChange);
    this.selectedIndexChanged$.subscribe(console.log);
  }
}

export const WATT_STEPPER = [WattStepperComponent, WattStepperStepComponent];
