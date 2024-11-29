import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { GridAreaStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  standalone: true,
  selector: 'dh-gridarea-status-badge',
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.gridAreas.status'">
      @switch (status()) {
        @case ('Created') {
          <watt-badge type="neutral">{{ t('Created') }}</watt-badge>
        }
        @case ('Active') {
          <watt-badge type="success">{{ t('Active') }}</watt-badge>
        }
        @case ('Expired') {
          <watt-badge type="warning">{{ t('Expired') }}</watt-badge>
        }
        @case ('Archived') {
          <watt-badge type="neutral">{{ t('Archived') }}</watt-badge>
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
export class DhGridAreaStatusBadgeComponent {
  status = input.required<GridAreaStatus>();
}
