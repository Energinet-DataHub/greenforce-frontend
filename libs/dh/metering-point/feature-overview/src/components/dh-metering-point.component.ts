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
import { Router, RouterLink } from '@angular/router';
import { Component, computed, inject, input } from '@angular/core';
import { translateSignal, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  VaterStackComponent,
  VaterSpacerComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

import { WATT_CARD } from '@energinet/watt/card';
import { WATT_LINK_TABS } from '@energinet/watt/tabs';
import { WATT_BREADCRUMBS } from '@energinet/watt/breadcrumbs';

import {
  DhActorStorage,
  DhMarketRoleRequiredDirective,
  DhPermissionRequiredDirective,
} from '@energinet-datahub/dh/shared/feature-authorization';

import {
  EicFunction,
  GetMeteringPointByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhToolbarPortalComponent } from '@energinet-datahub/dh/core/ui-toolbar-portal';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/release-toggle';
import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';

import { DhCanSeeDirective } from './can-see/dh-can-see.directive';
import { DhAddressInlineComponent } from './address/dh-address-inline.component';
import { DhMeteringPointStatusComponent } from './dh-metering-point-status.component';
import { DhMeteringPointActionsComponent } from './dh-metering-point-actions.component';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';

@Component({
  selector: 'dh-metering-point',
  imports: [
    RouterLink,
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_LINK_TABS,
    WATT_BREADCRUMBS,
    WATT_DESCRIPTION_LIST,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,
    DhCanSeeDirective,
    DhToolbarPortalComponent,
    DhEmDashFallbackPipe,
    DhAddressInlineComponent,
    DhReleaseToggleDirective,
    DhPermissionRequiredDirective,
    DhMarketRoleRequiredDirective,
    DhMeteringPointStatusComponent,
    DhMeteringPointActionsComponent,
  ],
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
    @let rolesWithAccess =
      [
        EicFunction.EnergySupplier,
        EicFunction.DanishEnergyAgency,
        EicFunction.GridAccessProvider,
        EicFunction.DataHubAdministrator,
        EicFunction.SystemOperator,
      ];

    <div class="page-grid">
      <div class="page-header" vater-stack direction="row" gap="m" wrap align="end">
        <div *transloco="let t; prefix: 'meteringPoint.overview'">
          <h2 vater-stack direction="row" gap="m" class="watt-space-stack-s">
            <span>
              {{ meteringPointId() }}
              <ng-content *dhMarketRoleRequired="rolesWithAccess">
                • <dh-address-inline [address]="this.metadata()?.installationAddress" />
              </ng-content>
            </span>
            <dh-metering-point-status [status]="metadata()?.connectionState" />
          </h2>
          <watt-description-list variant="inline-flow">
            <watt-description-list-item [label]="t('shared.meteringPointType')">
              @if (metadata()?.type) {
                {{ 'meteringPointType.' + metadata()?.type | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>
            <watt-description-list-item
              *dhCanSee="'energy-supplier-name'; meteringPoint: meteringPoint()"
              [label]="t('shared.energySupplier')"
            >
              {{ commercialRelation()?.energySupplierName?.value | dhEmDashFallback }}
            </watt-description-list-item>

            <watt-description-list-item [label]="t('details.meteringPointSubType')">
              @if (metadata()?.subType) {
                {{ 'meteringPointSubType.' + metadata()?.subType | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>
            <watt-description-list-item [label]="t('details.resolutionLabel')">
              @if (metadata()?.resolution) {
                {{ 'resolution.' + metadata()?.resolution | transloco }}
              } @else {
                {{ null | dhEmDashFallback }}
              }
            </watt-description-list-item>
          </watt-description-list>
        </div>

        <vater-spacer />

        <dh-metering-point-actions
          [meteringPointId]="meteringPointId()"
          [type]="metadata()?.type"
          [subType]="metadata()?.subType"
          [connectionState]="metadata()?.connectionState"
          [installationAddress]="metadata()?.installationAddress"
          [createdDate]="meteringPoint()?.createdDate"
        />
      </div>

      <div class="page-tabs" *transloco="let t; prefix: 'meteringPoint.tabs'">
        <watt-link-tabs vater inset="0">
          <watt-link-tab
            *dhMarketRoleRequired="rolesWithAccess"
            [label]="t('masterData.tabLabel')"
            [link]="getLink('master-data')"
          />
          <ng-container *dhReleaseToggle="'PM116-PROCESSOVERVIEW'">
            <watt-link-tab
              *dhPermissionRequired="['metering-point:process-overview']"
              [label]="t('processes.tabLabel')"
              [link]="getLink('process-overview')"
            />
          </ng-container>
          <ng-container *dhReleaseToggle="'PM60-CHARGE-LINKS-UI'">
            <watt-link-tab
              *dhPermissionRequired="['metering-point:prices']"
              [label]="t('chargelinks.tabLabel')"
              [link]="getLink('charge-links')"
            />
          </ng-container>
          <watt-link-tab [label]="t('messages.tabLabel')" [link]="getLink('messages')" />
          <watt-link-tab
            *dhMarketRoleRequired="rolesWithAccess"
            [label]="t('measurements.tabLabel')"
            [link]="getLink('measurements')"
          />
          <watt-link-tab
            *dhMarketRoleRequired="[EicFunction.DataHubAdministrator]"
            [label]="t('failedMeasurements.tabLabel')"
            [link]="getLink('failed-measurements')"
          />
        </watt-link-tabs>
      </div>
    </div>
  `,
})
export class DhMeteringPointComponent {
  private readonly router = inject(Router);
  private readonly actor = inject(DhActorStorage).getSelectedActor();

  meteringPointId = input.required<string>();
  internalMeteringPointId = input.required<string>();

  private meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      actorGln: this.actor.gln,
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

  breadcrumbs = computed(() => [
    {
      label: this.breadcrumbLabel(),
      url: this.router.createUrlTree([getPath<BasePaths>('metering-point')]).toString(),
    },
    ...(this.meteringPoint()?.isChild
      ? [
          {
            label: this.meteringPoint()?.metadata.parentMeteringPoint ?? '',
            url: this.router
              .createUrlTree([
                getPath<BasePaths>('metering-point'),
                this.meteringPoint()?.metadata.internalMeteringPointParentId ?? '',
                getPath<MeteringPointSubPaths>('master-data'),
              ])
              .toString(),
          },
        ]
      : []),
    {
      label: this.meteringPointId(),
      url: this.router
        .createUrlTree([
          getPath<BasePaths>('metering-point'),
          this.internalMeteringPointId(),
          getPath<MeteringPointSubPaths>('master-data'),
        ])
        .toString(),
    },
  ]);

  getLink = (path: MeteringPointSubPaths) => getPath(path);
}
