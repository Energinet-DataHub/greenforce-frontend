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
import { Component, input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

import { ChargeStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
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
