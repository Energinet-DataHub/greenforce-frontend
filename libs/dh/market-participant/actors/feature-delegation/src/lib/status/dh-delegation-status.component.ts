import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { ActorDelegationStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

@Component({
  selector: 'dh-delegation-status',
  imports: [TranslocoDirective, WattBadgeComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.delegation.status'">
      @switch (status()) {
        @case ('ACTIVE') {
          <watt-badge type="success">{{ t(status()) }}</watt-badge>
        }
        @case ('AWAITING') {
          <watt-badge type="info">{{ t(status()) }}</watt-badge>
        }
        @case ('EXPIRED') {
          <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
        }
        @case ('CANCELLED') {
          <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
        }
      }
    </ng-container>
  `,
})
export class DhDelegationStatusComponent {
  status = input.required<ActorDelegationStatus>();
}
