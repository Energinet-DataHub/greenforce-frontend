//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ActorStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
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
        @case ('ToBeDiscontinued') {
          <watt-badge type="warning">{{ t('ToBeDiscontinued') }}</watt-badge>
        }
        @case ('Discontinued') {
          <watt-badge type="neutral">{{ t('Discontinued') }}</watt-badge>
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
