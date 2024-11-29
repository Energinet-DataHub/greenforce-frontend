import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgClass],
  selector: 'watt-description-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgClass],
  template: `<ng-template #templateRef
    ><div [ngClass]="{ 'force-new-row': forceNewRow() }">
      <dt class="watt-label watt-on-light--high-emphasis">{{ label() }}</dt>
      <dd class="watt-text-s">{{ value() }}<ng-content /></dd></div
  ></ng-template>`,
})
export class WattDescriptionListItemComponent<T> {
  templateRef = viewChild.required<TemplateRef<unknown | null>>('templateRef');
  label = input<string>('');
  value = input<T | null>(null);
  forceNewRow = input(false);
}
