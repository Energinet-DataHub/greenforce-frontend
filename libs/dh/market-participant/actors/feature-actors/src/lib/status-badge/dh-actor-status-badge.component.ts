import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ActorStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  standalone: true,
  selector: 'dh-actor-status-badge',
  template: `
    <ng-container
      [ngSwitch]="status"
      *transloco="let t; read: 'marketParticipant.actorsOverview.status'"
    >
      <watt-badge *ngSwitchCase="'New'" type="success">{{ t('New') }}</watt-badge>
      <watt-badge *ngSwitchCase="'Active'" type="success">{{ t('Active') }}</watt-badge>
      <watt-badge *ngSwitchCase="'Inactive'" type="success">{{ t('Inactive') }}</watt-badge>
      <watt-badge *ngSwitchCase="'Passive'" type="success">{{ t('Passive') }}</watt-badge>

      <ng-container *ngSwitchDefault>{{ status | dhEmDashFallback }} </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule, DhEmDashFallbackPipe, WattBadgeComponent],
})
export class DhActorStatusBadgeComponent {
  @Input({ required: true }) status: ActorStatus | null | undefined = null;
}
