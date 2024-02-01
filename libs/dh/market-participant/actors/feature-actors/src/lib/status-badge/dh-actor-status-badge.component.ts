/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

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
      <watt-badge *ngSwitchCase="'Active'" type="success">{{ t('Active') }}</watt-badge>
      <watt-badge *ngSwitchCase="'Inactive'" type="neutral">{{ t('Inactive') }}</watt-badge>

      <ng-container *ngSwitchDefault>{{ status | dhEmDashFallback }}</ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    TranslocoDirective,

    WattBadgeComponent,
    DhEmDashFallbackPipe,
  ],
})
export class DhActorStatusBadgeComponent {
  @Input({ required: true }) status: ActorStatus | null | undefined = null;
}
