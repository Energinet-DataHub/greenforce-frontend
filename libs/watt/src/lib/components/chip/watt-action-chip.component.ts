import { Component, input, output } from '@angular/core';

import { WattIcon } from '../../foundations/icon/icons';
import { WattChipComponent } from './watt-chip.component';
import { WattIconComponent } from '../../foundations/icon/icon.component';

@Component({
  standalone: true,
  imports: [WattChipComponent, WattIconComponent],
  selector: 'watt-action-chip',
  styles: [
    `
      :host {
        display: block;
      }

      .disabled {
        color: var(--watt-on-light-low-emphasis);
      }
    `,
  ],
  template: `
    <watt-chip [disabled]="disabled()">
      <button
        type="button"
        class="cdk-visually-hidden"
        (click)="$event.stopImmediatePropagation(); onClick.emit()"
        [disabled]="disabled()"
      ></button>
      <ng-content />
      <watt-icon
        size="s"
        [name]="icon()"
        class="menu-icon"
        [attr.aria-hidden]="true"
        [class.disabled]="disabled()"
      />
    </watt-chip>
  `,
})
export class WattActionChipComponent {
  disabled = input(false);
  icon = input.required<WattIcon>();
  onClick = output<void>();
}
