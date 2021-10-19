import { Component, Input, ViewEncapsulation } from '@angular/core';
import { WattIcon } from '@energinet-datahub/watt';

/**
 * Usage:
 * `import WattEmptyStateModule from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-empty-state',
  styleUrls: ['./empty-state.component.scss'],
  templateUrl: './empty-state.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WattEmptyStateComponent {
  @Input() icon: WattIcon = 'explore';
  @Input() title!: string;
  @Input() msg!: string;
}
