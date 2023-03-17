import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'watt-stepper-step',
  template: `<ng-template #templateRef>
    <ng-content></ng-content>
  </ng-template>`,

  standalone: true,
})
export class WattStepperStepComponent {
  @ViewChild('templateRef') public templateRef: TemplateRef<unknown> | null = null;
}
