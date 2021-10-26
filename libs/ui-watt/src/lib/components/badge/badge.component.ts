import { Component, HostBinding, Input } from '@angular/core';

export type WattBadgeType = 'warning' | 'success' | 'danger' | 'info';

/**
 * Usage:
 * `import { WattBadgeModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-badge',
  styleUrls: ['./badge.component.scss'],
  templateUrl: './badge.component.html',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'watt-label',
  },
})
export class WattBadgeComponent {
  @Input() type: WattBadgeType = 'info';

  @HostBinding('class')
  get badgeType() {
    return `watt-badge-${this.type}`;
  }
}
