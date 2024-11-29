import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ActorStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  standalone: true,
  selector: 'dh-actor-status-badge',
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.actorsOverview.status'">
      @switch (status()) {
        @case ('Active') {
          <watt-badge type="success">{{ t('Active') }}</watt-badge>
        }
        @case ('Inactive') {
          <watt-badge type="neutral">{{ t('Inactive') }}</watt-badge>
        }
        @default {
          {{ status() | dhEmDashFallback }}
        }
      }
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WattBadgeComponent, DhEmDashFallbackPipe],
})
export class DhActorStatusBadgeComponent {
  status = input.required<ActorStatus | undefined>();
}
