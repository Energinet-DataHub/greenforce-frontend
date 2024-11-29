import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

import { WattIcon, WattIconComponent } from '../../foundations/icon';
import { WattIconSize } from '../../foundations/icon/watt-icon-size';

/**
 * Usage:
 * `import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';`
 */
@Component({
  selector: 'watt-empty-state',
  styleUrls: ['./empty-state.component.scss'],
  templateUrl: './empty-state.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, WattIconComponent],
})
export class WattEmptyStateComponent {
  @Input() icon?: WattIcon;
  @Input() size: 'small' | 'large' = 'large';
  @Input() title = '';
  @Input() message = '';

  @HostBinding('class') get currentSize(): string[] {
    return [`empty-state-${this.size}`];
  }

  get iconSize(): WattIconSize {
    if (this.size === 'small') {
      return 'xl';
    }

    return 'xxl';
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }
}
