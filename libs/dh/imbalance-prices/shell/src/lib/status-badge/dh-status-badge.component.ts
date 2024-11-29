import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ImbalancePriceStatus } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'imbalancePrices.status'">
      @switch (status()) {
        @case ('IN_COMPLETE') {
          <watt-badge type="danger">{{ t(status()) }}</watt-badge>
        }
        @case ('NO_DATA') {
          <watt-badge type="danger">{{ t(status()) }}</watt-badge>
        }
        @case ('COMPLETE') {
          <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
        }
      }
    </ng-container>
  `,
  imports: [TranslocoDirective, WattBadgeComponent],
})
export class DhStatusBadgeComponent {
  status = input.required<ImbalancePriceStatus>();
}
