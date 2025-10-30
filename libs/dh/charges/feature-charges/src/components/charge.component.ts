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
import { GetChargeByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhToolbarPortalComponent } from '@energinet-datahub/dh/core/ui-toolbar-portal';
import { BasePaths, ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

import { DhChargeStatusComponent } from './status.component';
import { DhChargeActionsComponent } from './charge-actions.component';
import { WATT_DESCRIPTION_LIST } from '@energinet-datahub/watt/description-list';

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
    WATT_DESCRIPTION_LIST,
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

          <watt-description-list variant="inline-flow">
            <watt-description-list-item [label]="t('type')">
              @let chargeType = charge()?.chargeType;
              @if (chargeType) {
                {{ 'charges.chargeTypes.' + chargeType | transloco }}
              }
            </watt-description-list-item>
            <watt-description-list-item [label]="t('owner')">
              {{ charge()?.chargeOwnerName | dhEmDashFallback }}
            </watt-description-list-item>
            <watt-description-list-item [label]="t('resolution')">
              @let resolution = charge()?.resolution;
              @if (resolution) {
                {{ 'charges.resolutions.' + resolution | transloco }}
              }
            </watt-description-list-item>
            <watt-description-list-item [label]="t('vat')">
              @let vatClassification = charge()?.vatClassification;
              @if (vatClassification) {
                {{ 'charges.vatClassifications.' + vatClassification | transloco }}
              }
            </watt-description-list-item>
            <watt-description-list-item [label]="t('transparentInvoicing')">
              @let transparentInvoicing = charge()?.transparentInvoicing;
              {{ transparentInvoicing ? ('yes' | transloco) : ('no' | transloco) }}
            </watt-description-list-item>
          </watt-description-list>
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargeComponent {
  private readonly router = inject(Router);
  query = query(GetChargeByIdDocument, () => ({ variables: { id: this.id() } }));
  charge = computed(() => this.query.data()?.chargeById);
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
