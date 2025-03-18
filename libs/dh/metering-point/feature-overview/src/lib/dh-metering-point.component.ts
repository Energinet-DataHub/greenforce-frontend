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
import { Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhMeteringPointStatusComponent } from './dh-metering-point-status.component';
import { DhAddressInlineComponent } from './dh-address-inline.component';

@Component({
  selector: 'dh-metering-point',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WATT_LINK_TABS,
    VaterStackComponent,
    VaterUtilityDirective,

    DhEmDashFallbackPipe,
    DhResultComponent,
    DhMeteringPointStatusComponent,
    DhAddressInlineComponent,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    :host {
      display: block;
      height: 100%;
    }

    .page-grid {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100%;
    }

    .page-header {
      background-color: var(--watt-color-neutral-white);
      border-bottom: 1px solid var(--watt-color-neutral-grey-300);
      padding: var(--watt-space-m) var(--watt-space-ml);
    }

    .page-tabs {
      position: relative;
      overflow: auto;
    }
  `,
  template: `
    <dh-result [hasError]="hasError()" [loading]="loading()">
      <div class="page-grid">
        <div class="page-header" *transloco="let t; read: 'meteringPoint.overview'">
          <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
            <span>
              {{ meteringPointId() }} •
              <dh-address-inline [address]="this.meteringPoint()?.installationAddress" />
            </span>
            <dh-metering-point-status [status]="meteringPoint()?.connectionState" />
          </h2>

          <vater-stack direction="row" gap="ml">
            <span>
              <span class="watt-label watt-space-inline-s">{{
                t('shared.meteringPointType')
              }}</span>
              @if (meteringPoint()?.type) {
                {{ 'meteringPointType.' + meteringPoint()?.type | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </span>

            <span direction="row" gap="s">
              <span class="watt-label watt-space-inline-s">{{ t('shared.energySupplier') }}</span
              >{{ commercialRelation()?.energySupplierName?.value | dhEmDashFallback }}
            </span>
          </vater-stack>
        </div>

        <div class="page-tabs" *transloco="let t; read: 'meteringPoint.tabs'">
          <watt-link-tabs vater inset="0">
            <watt-link-tab [label]="t('masterData.tabLabel')" [link]="getLink('master-data')" />
            <watt-link-tab [label]="t('meterData.tabLabel')" [link]="getLink('meter-data')" />
          </watt-link-tabs>
        </div>
      </div>
    </dh-result>
  `,
})
export class DhMeteringPointComponent {
  private actor = inject(DhActorStorage).getSelectedActor();

  meteringPointId = input.required<string>();

  private meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: { meteringPointId: this.meteringPointId(), actorGln: this.actor?.gln ?? '' },
  }));
  private meteringPointDetails = computed(() => this.meteringPointQuery.data()?.meteringPoint);

  hasError = this.meteringPointQuery.hasError;
  loading = this.meteringPointQuery.loading;

  commercialRelation = computed(() => this.meteringPointDetails()?.commercialRelation);
  meteringPoint = computed(() => this.meteringPointDetails()?.metadata);

  getLink = (path: MeteringPointSubPaths) => getPath(path);
}
