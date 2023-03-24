import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatStep } from '@angular/material/stepper';

@Component({
  selector: 'watt-stepper-step',
  template: `<ng-template #templateRef>
    <ng-content></ng-content>
  </ng-template>`,
  standalone: true,
})
export class WattStepperStepComponent extends MatStep {
  @ViewChild('templateRef') public templateRef: TemplateRef<unknown> | null = null;
  @Input() public nextButtonLabel?: string;
  @Input() public previousButtonLabel?: string;
}
