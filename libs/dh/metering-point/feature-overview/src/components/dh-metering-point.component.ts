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
import { Router } from '@angular/router';
import { Component, computed, effect, inject, input } from '@angular/core';
import { translateSignal, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhBreadcrumbService } from '@energinet-datahub/dh/shared/navigation';
import {
  DhActorStorage,
  DhMarketRoleRequiredDirective,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  EicFunction,
  GetMeteringPointByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';

import { DhCanSeeDirective } from './can-see/dh-can-see.directive';
import { DhAddressInlineComponent } from './address/dh-address-inline.component';
import { DhMeteringPointStatusComponent } from './dh-metering-point-status.component';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  selector: 'dh-metering-point',
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_LINK_TABS,
    VaterStackComponent,
    VaterUtilityDirective,

    DhResultComponent,
    DhCanSeeDirective,
    DhEmDashFallbackPipe,
    DhAddressInlineComponent,
    DhMeteringPointStatusComponent,
    DhMarketRoleRequiredDirective,
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
    @let access =
      [
        EicFunction.EnergySupplier,
        EicFunction.DanishEnergyAgency,
        EicFunction.GridAccessProvider,
        EicFunction.DataHubAdministrator,
        EicFunction.SystemOperator,
      ];
    <dh-result [hasError]="hasError()" [loading]="loading()">
      <div class="page-grid">
        <div class="page-header" *transloco="let t; read: 'meteringPoint.overview'">
          <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
            <span>
              {{ meteringPointId() }}
              <ng-content *dhMarketRoleRequired="access">
                • <dh-address-inline [address]="this.metadata()?.installationAddress" />
              </ng-content>
            </span>
            <dh-metering-point-status [status]="metadata()?.connectionState" />
          </h2>

          <vater-stack direction="row" gap="ml">
            <span>
              <span class="watt-label watt-space-inline-s">{{
                t('shared.meteringPointType')
              }}</span>
              @if (metadata()?.type) {
                {{ 'meteringPointType.' + metadata()?.type | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </span>

            <span
              direction="row"
              gap="s"
              *dhCanSee="'energy-supplier-name'; meteringPoint: meteringPoint()"
            >
              <span class="watt-label watt-space-inline-s">{{ t('shared.energySupplier') }}</span
              >{{ commercialRelation()?.energySupplierName?.value | dhEmDashFallback }}
            </span>

            <span direction="row" gap="s">
              <span class="watt-label watt-space-inline-s">{{
                t('details.meteringPointSubType')
              }}</span>
              @if (metadata()?.subType) {
                {{ 'meteringPointSubType.' + metadata()?.subType | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </span>

            <span direction="row" gap="s">
              <span class="watt-label watt-space-inline-s">{{ t('details.resolutionLabel') }}</span>
              @if (metadata()?.resolution) {
                {{ 'resolution.' + metadata()?.resolution | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </span>
          </vater-stack>
        </div>

        <div class="page-tabs" *transloco="let t; read: 'meteringPoint.tabs'">
          <watt-link-tabs vater inset="0">
            <watt-link-tab
              *dhMarketRoleRequired="access"
              [label]="t('masterData.tabLabel')"
              [link]="getLink('master-data')"
            />
            <watt-link-tab [label]="t('messages.tabLabel')" [link]="getLink('messages')" />
            <watt-link-tab
              *dhMarketRoleRequired="access"
              [label]="t('measurements.tabLabel')"
              [link]="getLink('measurements')"
            />
          </watt-link-tabs>
        </div>
      </div>
    </dh-result>
  `,
})
export class DhMeteringPointComponent {
  private readonly router = inject(Router);
  private readonly breadcrumbService = inject(DhBreadcrumbService);
  private readonly actor = inject(DhActorStorage).getSelectedActor();
  private readonly featureFlagsService = inject(DhFeatureFlagsService);

  meteringPointId = input.required<string>();

  private meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      actorGln: this.actor.gln,
      enableNewSecurityModel: this.featureFlagsService.isEnabled('new-security-model'),
    },
  }));
  meteringPoint = computed(() => this.meteringPointQuery.data()?.meteringPoint);

  hasError = this.meteringPointQuery.hasError;
  loading = this.meteringPointQuery.loading;
  EicFunction = EicFunction;

  commercialRelation = computed(() => this.meteringPoint()?.commercialRelation);
  metadata = computed(() => this.meteringPoint()?.metadata);
  isEnergySupplierResponsible = computed(() => this.meteringPoint()?.isEnergySupplier);

  breadcrumbLabel = translateSignal('meteringPoint.breadcrumb');

  constructor() {
    effect(() => {
      this.breadcrumbService.navigationEnded();

      const label = this.breadcrumbLabel();

      if (!label) return;

      this.breadcrumbService.clearBreadcrumbs();

      this.breadcrumbService.addBreadcrumb({
        label,
        // eslint-disable-next-line sonarjs/no-duplicate-string
        url: getPath('metering-point'),
      });

      if (this.meteringPoint()?.isChild) {
        this.breadcrumbService.addBreadcrumb({
          label: this.meteringPoint()?.metadata.parentMeteringPoint ?? '',
          url: this.router
            .createUrlTree([
              getPath<BasePaths>('metering-point'),
              this.meteringPoint()?.metadata.parentMeteringPoint,
              getPath<MeteringPointSubPaths>('master-data'),
            ])
            .toString(),
        });
      }

      this.breadcrumbService.addBreadcrumb({
        label: this.meteringPointId(),
        url: this.router
          .createUrlTree([
            getPath<BasePaths>('metering-point'),
            this.meteringPointId(),
            getPath<MeteringPointSubPaths>('master-data'),
          ])
          .toString(),
      });
    });
  }

  getLink = (path: MeteringPointSubPaths) => getPath(path);
}
