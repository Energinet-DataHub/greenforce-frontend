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
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_MENU } from '@energinet/watt/menu';
import { WATT_LINK_TABS } from '@energinet/watt/tabs';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_BREADCRUMBS } from '@energinet/watt/breadcrumbs';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import {
  VaterStackComponent,
  VaterSpacerComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { GetChargeByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhToolbarPortalComponent } from '@energinet-datahub/dh/core/ui-toolbar-portal';
import { BasePaths, ChargesSubPaths, getPath } from '@energinet-datahub/dh/core/routing';

import { DhChargesStatus } from '@energinet-datahub/dh/charges/ui-shared';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-charges-information',
  styles: `
    @use '@energinet/watt/utils' as watt;

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
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    WATT_LINK_TABS,
    WATT_BREADCRUMBS,
    WATT_DESCRIPTION_LIST,
    WATT_MENU,
    WattButtonComponent,
    WattIconComponent,
    DhEmDashFallbackPipe,
    DhChargesStatus,
    DhToolbarPortalComponent,
    DhFeatureFlagDirective,
    DhPermissionRequiredDirective,
  ],
  providers: [DhNavigationService],
  template: `
    <dh-toolbar-portal>
      <watt-breadcrumbs *transloco="let t; prefix: 'charges.charge'">
        <watt-breadcrumb [routerLink]="parentUrl">
          {{ t('breadcrumb') }}
        </watt-breadcrumb>
        <watt-breadcrumb>
          {{ charge()?.displayName }}
        </watt-breadcrumb>
      </watt-breadcrumbs>
    </dh-toolbar-portal>
    <div class="page-grid" *transloco="let t; prefix: 'charges'">
      <div class="page-header" vater-stack direction="row" gap="m" wrap align="end">
        @if (charge(); as charge) {
          <div>
            <vater-stack direction="row" gap="m">
              <h2 [style.margin]="0">{{ charge.displayName }}</h2>
              <dh-charges-status [status]="charge.status" />
            </vater-stack>
            <watt-description-list variant="inline-flow">
              <watt-description-list-item [label]="t('charge.type')">
                {{ t('chargeTypes.' + charge.type) }}
              </watt-description-list-item>
              <watt-description-list-item [label]="t('charge.owner')">
                {{ charge.owner?.displayName | dhEmDashFallback }}
              </watt-description-list-item>
              <watt-description-list-item [label]="t('charge.resolution')">
                {{ t('resolutions.' + charge.resolution) }}
              </watt-description-list-item>
              <watt-description-list-item [label]="t('charge.vat')">
                {{ t('vatInclusive.' + charge.vatInclusive) }}
              </watt-description-list-item>
              <watt-description-list-item [label]="t('charge.transparentInvoicing')">
                {{ charge.transparentInvoicing ? ('yes' | transloco) : ('no' | transloco) }}
              </watt-description-list-item>
            </watt-description-list>
          </div>
        }

        <vater-spacer />

        <ng-container *dhPermissionRequired="['charges:manage']">
          <watt-button variant="secondary" [wattMenuTriggerFor]="menu">
            {{ t('charge.actions.menu') }}
            <watt-icon name="moreVertical" />
          </watt-button>
          <watt-menu #menu>
            <watt-menu-item [routerLink]="[{ outlets: { actions: ['edit'] } }]">
              {{ t('charge.actions.edit') }}
            </watt-menu-item>
            <watt-menu-item [routerLink]="[{ outlets: { actions: ['stop'] } }]">
              {{ t('charge.actions.stop') }}
            </watt-menu-item>
            <watt-menu-item [routerLink]="[{ outlets: { actions: ['upload-series'] } }]">
              {{ t('charge.actions.uploadSeries') }}
            </watt-menu-item>
          </watt-menu>
        </ng-container>
      </div>

      <div class="page-tabs" *transloco="let t; prefix: 'charges.charge.tabs'">
        <watt-link-tabs vater inset="0">
          <watt-link-tab [label]="t('pricesLabel')" [link]="getLink('prices', resolution())" />
          <watt-link-tab [label]="t('informationLabel')" [link]="getLink('information')" />
          <watt-link-tab
            *dhFeatureFlag="'charges-history'"
            [label]="t('historyLabel')"
            [link]="getLink('history')"
          />
        </watt-link-tabs>
      </div>
    </div>
    <router-outlet name="actions" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhChargesInformation {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly id = input.required<string>();
  query = query(GetChargeByIdDocument, () => ({ variables: { id: this.id() } }));
  charge = computed(() => this.query.data()?.chargeById);
  resolution = computed(() => this.charge()?.resolution ?? 'unknown');
  getLink = (path: ChargesSubPaths, ...paths: string[]) => [getPath(path), ...paths].join('/');
  parentUrl = this.router.createUrlTree([getPath<BasePaths>('charges')], {
    // Preserve filters when navigating back to list view
    queryParams: this.route.snapshot.queryParams,
  });
}
