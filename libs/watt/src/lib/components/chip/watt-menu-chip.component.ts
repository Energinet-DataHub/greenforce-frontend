import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattChipComponent } from './watt-chip.component';

export type WattMenuChipHasPopup = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

@Component({
  standalone: true,
  imports: [WattChipComponent, WattIconComponent],
  selector: 'watt-menu-chip',
  styles: [
    `
      :host {
        display: block;
      }

      .menu-icon {
        margin-left: var(--watt-space-xs);
        transition: linear 0.2s all;
        color: var(--watt-color-primary);

        &.disabled {
          color: var(--watt-on-light-low-emphasis);
        }
      }

      .opened {
        transform: rotate(180deg);
      }

      .selected {
        color: var(--watt-color-neutral-white);
      }

      .disabled {
        color: var(--watt-on-light-low-emphasis);
      }
    `,
  ],
  template: `
    <watt-chip [disabled]="disabled" [selected]="selected">
      <button
        class="cdk-visually-hidden"
        [attr.aria-haspopup]="hasPopup"
        [attr.aria-expanded]="opened"
        [attr.aria-pressed]="selected"
        (click)="toggle.emit()"
        [disabled]="disabled"
      ></button>
      <ng-content />
      <watt-icon
        size="s"
        name="arrowDropDown"
        class="menu-icon"
        [attr.aria-hidden]="true"
        [class.opened]="opened"
        [class.selected]="selected"
        [class.disabled]="disabled"
      />
    </watt-chip>
  `,
})
export class WattMenuChipComponent {
  @Input() opened = false;
  @Input() disabled = false;
  @Input() name?: string;
  @Input() value?: string;
  @Input() selected = false;
  @Input() hasPopup: WattMenuChipHasPopup = 'menu';
  @Output() toggle = new EventEmitter<void>();
}
