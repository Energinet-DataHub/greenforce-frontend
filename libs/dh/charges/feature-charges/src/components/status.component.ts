import { Component, input } from '@angular/core';
import { ChargeStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-charge-status',
  imports: [TranslocoDirective, WattBadgeComponent, DhEmDashFallbackPipe],
  template: `
    @let _status = status();
    <ng-container *transloco="let t; prefix: 'charges.charges.table.chargeStatus'">
      @switch (_status) {
        @case ('AWAITING') {
          <watt-badge type="info">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('CLOSED') {
          <watt-badge type="neutral">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('CANCELLED') {
          <watt-badge type="neutral">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('CURRENT') {
          <watt-badge type="success">
            {{ t(_status) }}
          </watt-badge>
        }
        @case ('MISSING_PRICE_SERIES') {
          <watt-badge type="warning">{{ t(_status) }}</watt-badge>
        }
        @default {
          {{ _status | dhEmDashFallback }}
        }
      }
    </ng-container>
  `,
})
export class DhChargeStatusComponent {
  status = input.required<ChargeStatus>();
}
