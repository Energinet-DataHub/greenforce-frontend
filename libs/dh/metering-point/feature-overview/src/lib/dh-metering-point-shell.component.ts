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
import { Component, computed, effect, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';

import { DhMeteringPointStatusComponent } from './dh-metering-point-status.component';
import { DhAddressInlineComponent } from './dh-address-inline.component';

@Component({
  selector: 'dh-metering-point-shell',
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WATT_CARD,
    WATT_LINK_TABS,

    DhEmDashFallbackPipe,
    DhResultComponent,
    DhMeteringPointStatusComponent,
    DhAddressInlineComponent,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
    }

    .page-header {
      background-color: var(--watt-color-neutral-white);
      border-bottom: 1px solid var(--watt-color-neutral-grey-300);
      padding: var(--watt-space-m) var(--watt-space-ml);
    }
  `,
  template: `
    <dh-result [hasError]="hasError()" [loading]="loading()">
      <div *transloco="let t; read: 'meteringPoint.overview'" class="page-header">
        <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
          <span>
            {{ meteringPointId() }} •
            <dh-address-inline [address]="this.meteringPoint()?.installationAddress" />
          </span>
          <dh-metering-point-status [status]="meteringPoint()?.connectionState ?? 'Unknown'" />
        </h2>

        <vater-stack direction="row" gap="ml">
          <span>
            <span class="watt-label watt-space-inline-s">{{ t('shared.meteringPointType') }}</span
            >{{ meteringPoint()?.type | dhEmDashFallback }}
          </span>

          <span direction="row" gap="s">
            <span class="watt-label watt-space-inline-s">{{ t('shared.energySupplier') }}</span
            >{{ commercialRelation()?.energySupplier | dhEmDashFallback }}
          </span>
        </vater-stack>
      </div>

      <ng-container *transloco="let t; read: 'meteringPoint.tabs'">
        <watt-link-tabs>
          <watt-link-tab [label]="t('overview.tabLabel')" [link]="getLink('overview')" />
          <watt-link-tab [label]="t('meteredData.tabLabel')" [link]="getLink('metered-data')" />
        </watt-link-tabs>
      </ng-container>
    </dh-result>
  `,
})
export class DhMeteringPointShellComponent {
  private meteringPointQuery = lazyQuery(GetMeteringPointByIdDocument);

  meteringPointId = input.required<string>();

  hasError = this.meteringPointQuery.hasError;
  loading = this.meteringPointQuery.loading;

  meteringPointDetails = computed(() => this.meteringPointQuery.data()?.meteringPoint);
  commercialRelation = computed(() => this.meteringPointDetails()?.currentCommercialRelation);
  meteringPoint = computed(() => this.meteringPointDetails()?.currentMeteringPointPeriod);

  constructor() {
    effect(() => {
      this.meteringPointQuery.query({ variables: { meteringPointId: this.meteringPointId() } });
    });
  }

  getLink = (path: MeteringPointSubPaths) => getPath(path);
}
