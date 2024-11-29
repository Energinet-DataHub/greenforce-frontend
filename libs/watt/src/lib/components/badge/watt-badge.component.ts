import { Component, computed, input } from '@angular/core';

export type WattBadgeType =
  | 'warning'
  | 'success'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'version'
  | 'skeleton';

export type WattBadgeSize = 'normal' | 'large';

/**
 * Usage:
 * `import { WattBadgeComponent } from '@energinet-datahub/watt/badge';`
 */
@Component({
  standalone: true,
  selector: 'watt-badge',
  styleUrls: ['./watt-badge.component.scss'],
  template: '<ng-content />',
  host: {
    '[class]': 'badgeType()',
    '[class.watt-badge-large]': 'isLarge()',
  },
})
export class WattBadgeComponent {
  type = input<WattBadgeType>('info');
  size = input<WattBadgeSize>('normal');
  badgeType = computed(() => `watt-badge-${this.type()}`);
  isLarge = computed(() => this.size() === 'large');
}
