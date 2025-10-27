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
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { translateSignal, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { GetChargeDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhToolbarPortalComponent } from '@energinet-datahub/dh/core/ui-toolbar-portal';
import { BasePaths, ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

import { DhChargeStatusComponent } from './status.component';
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
    RouterLink,
    TranslocoPipe,
    TranslocoDirective,
    VaterStackComponent,
    VaterSpacerComponent,
    WATT_LINK_TABS,
    WATT_BREADCRUMBS,
    DhEmDashFallbackPipe,
    DhChargeStatusComponent,
    DhChargeActionsComponent,
    DhToolbarPortalComponent,
  ],
  template: `
    <dh-toolbar-portal>
      <watt-breadcrumbs>
        @for (breadcrumb of breadcrumbs(); track $index) {
          <watt-breadcrumb [routerLink]="breadcrumb.url">
            {{ breadcrumb.label }}
          </watt-breadcrumb>
        }
      </watt-breadcrumbs>
    </dh-toolbar-portal>
    <div class="page-grid">
      <div class="page-header" vater-stack direction="row" gap="m" wrap align="end">
        <div *transloco="let t; prefix: 'charges.charge'">
          <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
            {{ chargeIdName() }}
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
        <watt-link-tab [label]="t('informationLabel')" [link]="getLink('information')" />
        <watt-link-tab [label]="t('historyLabel')" [link]="getLink('history')" />
      </watt-link-tabs>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargeComponent {
  private readonly router = inject(Router);
  query = query(GetChargeDocument, () => ({ variables: { id: this.id() } }));
  charge = computed(() => this.query.data()?.charge);
  chargeIdName = computed(() => `${this.charge()?.chargeId} • ${this.charge()?.chargeName}`);
  id = input.required<string>();
  getLink = (path: ChargesSubPaths) => getPath(path);

  breadcrumbLabel = translateSignal('charges.charge.breadcrumb');

  breadcrumbs = computed(() => [
    {
      label: this.breadcrumbLabel(),
      url: this.router.createUrlTree([getPath<BasePaths>('charges')]).toString(),
    },
    {
      label: this.chargeIdName(),
      url: this.router
        .createUrlTree([
          getPath<BasePaths>('charges'),
          this.id(),
          getPath<ChargesSubPaths>('prices'),
        ])
        .toString(),
    },
  ]);
}
