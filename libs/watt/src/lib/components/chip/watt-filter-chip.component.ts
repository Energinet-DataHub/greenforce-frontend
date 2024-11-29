import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattChipComponent } from './watt-chip.component';
import { useIsFirstRender } from '../../utils/lifecycle/use-is-first-render';

@Component({
  standalone: true,
  imports: [WattChipComponent, WattIconComponent],
  selector: 'watt-filter-chip',
  template: `
    <watt-chip [disabled]="disabled" [selected]="isFirstRender() ? selected : input.checked">
      <input
        #input
        class="cdk-visually-hidden"
        [type]="choice === undefined ? 'checkbox' : 'radio'"
        [name]="name"
        [value]="value"
        [checked]="selected"
        [disabled]="disabled"
        (change)="onChange(input)"
      />
      <ng-content />
    </watt-chip>
  `,
})
export class WattFilterChipComponent<T = string> {
  @Input() selected = false;
  @Input() disabled = false;
  @Input() name?: string;
  @Input() value?: T;
  @Input() choice?: string;
  @Output() selectionChange = new EventEmitter<T>();
  isFirstRender = useIsFirstRender();

  onChange(input: HTMLInputElement): void {
    const value = this.choice !== undefined ? input.value : input.checked;
    this.selectionChange.emit(value as T);
  }
}
