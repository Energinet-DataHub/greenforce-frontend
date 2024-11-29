import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { WattIconComponent } from '../../foundations/icon/icon.component';

@Component({
  standalone: true,
  imports: [WattIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-chip',
  styleUrls: ['./watt-chip.component.scss'],
  template: `
    <label
      [class.selected]="selected()"
      [class.disabled]="disabled()"
      [class.read-only]="readonly()"
    >
      @if (selected()) {
        <watt-icon class="selected-icon" name="checkmark" size="s" [attr.aria-hidden]="true" />
      }
      <ng-content />
    </label>
  `,
})
export class WattChipComponent {
  selected = input(false);
  disabled = input(false);
  readonly = input(false);
}
