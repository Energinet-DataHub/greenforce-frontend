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
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhCustomerOverviewComponent } from './dh-customer-overview.component';

@Component({
  selector: 'dh-metering-point-overview',
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WATT_CARD,
    DhEmDashFallbackPipe,
    DhCustomerOverviewComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .page-header {
      background-color: var(--watt-color-neutral-white);
      box-shadow: var(--watt-bottom-box-shadow);
      padding: var(--watt-space-m) var(--watt-space-ml);
    }

    .page-content {
      margin: var(--watt-space-ml);
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'meteringPoint.overview'">
      <div class="page-header">
        <h2 class="watt-space-stack-s">{{ meteringPointId() }}</h2>

        <vater-stack direction="row" gap="ml">
          <span>
            <span class="watt-label watt-space-inline-s">{{ t('meta.meteringPointType') }}</span
            >{{ null | dhEmDashFallback }}
          </span>

          <span direction="row" gap="s">
            <span class="watt-label watt-space-inline-s">{{ t('meta.energySupplier') }}</span
            >{{ null | dhEmDashFallback }}
          </span>
        </vater-stack>
      </div>

      <div class="page-content">
        <dh-customer-overview />
      </div>
    </ng-container>
  `,
})
export class DhMeteringPointOverviewComponent {
  meteringPointId = input.required<string>();
}
