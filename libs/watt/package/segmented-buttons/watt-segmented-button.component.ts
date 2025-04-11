import { Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'watt-segmented-button',
  template: ` <ng-template>
    <ng-content />
  </ng-template>`,
})
export class WattSegmentedButtonComponent {
  templateRef = viewChild.required<TemplateRef<unknown>>(TemplateRef);
  value = input.required<string>();
}
