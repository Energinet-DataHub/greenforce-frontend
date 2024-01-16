import { Component, Input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ImbalancePriceStatus } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-status-badge',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'imbalancePrices.status'">
      @switch (status) {
        @case ('MISSING_PRICES') {
          <watt-badge type="danger">{{ t(status) }}</watt-badge>
        }
        @case ('COMPLETE') {
          <watt-badge type="neutral">{{ t(status) }}</watt-badge>
        }
      }
    </ng-container>
  `,
  imports: [TranslocoDirective, WattBadgeComponent],
})
export class DhStatusBadgeComponent {
  @Input({ required: true }) status!: ImbalancePriceStatus;
}
