import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatStep } from '@angular/material/stepper';
import { CdkStep } from '@angular/cdk/stepper';
export { CdkStep as WattStep };

@Component({
  selector: 'watt-stepper-step',
  template: `<ng-template #templateRef>
    <ng-content />
  </ng-template>`,
  standalone: true,
})
export class WattStepperStepComponent extends MatStep {
  @ViewChild('templateRef') public templateRef: TemplateRef<unknown> | null = null;

  @Input() nextButtonLabel?: string;
  @Input() disableNextButton = false;
  @Input() loadingNextButton = false;
  @Input() previousButtonLabel?: string;
  @Input() enabled = true;

  @Output() entering = new EventEmitter<CdkStep>();
  @Output() leaving = new EventEmitter<CdkStep>();
  @Output() next = new EventEmitter<void>();
}
