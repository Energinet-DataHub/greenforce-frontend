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
//#endregione';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';
import { GetChargeDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { DhChargeStatusComponent } from './status.component';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhChargeActionsComponent } from './charge-actions.component';

@Component({
  selector: 'dh-charge',
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
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    VaterStackComponent,
    VaterSpacerComponent,
    WATT_LINK_TABS,
    DhEmDashFallbackPipe,
    DhChargeStatusComponent,
    DhChargeActionsComponent,
  ],
  template: `<div class="page-grid">
    <div class="page-header" vater-stack direction="row" gap="m" wrap align="end">
      <div *transloco="let t; prefix: 'charges.charge'">
        <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
          {{ charge()?.chargeId | dhEmDashFallback }} {{ charge()?.chargeName | dhEmDashFallback }}
          @let status = charge()?.status;

          @if (status) {
            <dh-charge-status [status]="status" />
          }
        </h2>

        <vater-stack direction="row" gap="ml">
          <span class="watt-text-s">
            <span class="watt-label watt-space-inline-xs">{{ t('type') }}</span>
            @let chargeType = charge()?.chargeType;
            @if (chargeType) {
              {{ 'charges.chargeTypes.' + chargeType | transloco }}
            }
          </span>

          <span direction="row" gap="s" class="watt-text-s">
            <span class="watt-label watt-space-inline-xs">{{ t('owner') }}</span>

            {{ charge()?.chargeOwnerName | dhEmDashFallback }}
          </span>

          <span direction="row" gap="s" class="watt-text-s">
            <span class="watt-label watt-space-inline-xs">{{ t('resolution') }}</span>
            {{ 'charges.resolutions.' + charge()?.resolution | transloco }}
          </span>

          <span direction="row" gap="s" class="watt-text-s">
            <span class="watt-label watt-space-inline-xs">{{ t('vat') }}</span>
            {{ 'charges.vatClassifications.' + charge()?.vatClassification | transloco }}
          </span>

          <span direction="row" gap="s" class="watt-text-s">
            <span class="watt-label watt-space-inline-xs">{{ t('transparentInvoicing') }}</span>
            {{ charge()?.transparentInvoicing ? ('yes' | transloco) : ('no' | transloco) }}
          </span>
        </vater-stack>
      </div>

      <vater-spacer />

      <dh-charge-actions />
    </div>

    <div class="page-tabs" *transloco="let t; prefix: 'charges.charge.tabs'">
      <watt-link-tabs vater inset="0">
        <watt-link-tab [label]="t('pricesLabel')" [link]="getLink('prices')" />
      </watt-link-tabs>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargeComponent {
  query = query(GetChargeDocument, () => ({ variables: { id: this.id() } }));
  charge = computed(() => this.query.data()?.charge);
  id = input.required<string>();
  getLink = (path: ChargesSubPaths) => getPath(path);
}
