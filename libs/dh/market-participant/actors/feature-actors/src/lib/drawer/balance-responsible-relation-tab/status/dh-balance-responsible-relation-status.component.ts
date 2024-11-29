import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { BalanceResponsibilityAgreementStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

@Component({
  selector: 'dh-balance-responsible-relation-status',
  imports: [TranslocoDirective, WattBadgeComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container
      *transloco="
        let t;
        read: 'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation.statusOptions'
      "
    >
      @switch (status()) {
        @case ('ACTIVE') {
          <watt-badge type="success">{{ t(status()) }}</watt-badge>
        }
        @case ('AWAITING') {
          <watt-badge type="info">{{ t(status()) }}</watt-badge>
        }
        @case ('SOON_TO_EXPIRE') {
          <watt-badge type="warning">{{ t(status()) }}</watt-badge>
        }
        @case ('EXPIRED') {
          <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
        }
      }
    </ng-container>
  `,
})
export class DhBalanceResponsibleRelationStatusComponent {
  status = input.required<BalanceResponsibilityAgreementStatus>();
}
