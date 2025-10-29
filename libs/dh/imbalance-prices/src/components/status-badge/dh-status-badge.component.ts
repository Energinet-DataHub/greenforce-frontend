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
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet/watt/badge';
import { ImbalancePriceStatus } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t; prefix: 'imbalancePrices.status'">
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
