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
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { combineWithIdPaths, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import {
  ConnectionState,
  GetRelatedMeteringPointsByIdDocument,
  RelatedMeteringPointDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-related-metering-points-v2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterSpacerComponent,
    WATT_CARD,
    WATT_TABLE,
    WattBadgeComponent,
    WattDatePipe,
    WattButtonComponent,
    WattIconComponent,
    DhResultComponent,
  ],
  styles: `
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr min-content;
      margin: 0 calc(-1 * var(--watt-space-m));
    }

    .grid-row {
      display: contents;

      &:hover > * {
        background-color: var(--watt-color-neutral-grey-100);
        cursor: pointer;
      }

      & > * {
        border-top: 1px solid var(--watt-color-neutral-grey-300);
        padding-block: var(--watt-space-s);
        padding-inline-end: var(--watt-space-m);
      }

      & > :first-child {
        padding-inline-start: var(--watt-space-m);
      }

      & > :last-child {
        align-content: center;
      }
    }

    .closed-down-state {
      color: var(--watt-color-state-danger);
    }
  `,
  template: `
    <watt-card>
      <watt-card-title>
        <vater-stack direction="row" align="center">
          <h3>{{ 'meteringPoint.relatedMeteringPointsTitle' | transloco }}</h3>
          <vater-spacer />

          @if (hasHistorical()) {
            <watt-button size="small" variant="text" (click)="toggleHistorical()">{{
              showHistorical()
                ? ('meteringPoint.hideHistoricalButton' | transloco)
                : ('meteringPoint.showHistoricalButton' | transloco)
            }}</watt-button>
          }
        </vater-stack>
      </watt-card-title>

      <dh-result
        [loading]="query.loading()"
        [hasError]="query.hasError()"
        [empty]="relatedMeteringPointsList().length === 0"
        variant="compact"
        [loadingText]="'meteringPoint.relatedMeteringPointsLoading' | transloco"
        [emptyText]="'meteringPoint.relatedMeteringPointsEmpty' | transloco"
      >
        <div class="grid-container">
          @for (meteringPoint of relatedMeteringPointsList(); track meteringPoint.identification) {
            <div
              class="grid-row"
              [routerLink]="getLink('master-data', meteringPoint.identification)"
            >
              <div class="grid-cell">
                <span class="watt-text-m watt-on-light--high-emphasis">
                  {{ 'meteringPointType.' + meteringPoint.type | transloco }}
                </span>
                <br />
                <span class="watt-on-light--medium-emphasis">
                  {{ meteringPoint.identification }}
                </span>
              </div>

              <div class="grid-cell">
                <span
                  *transloco="let t; prefix: 'meteringPoint.overview.status'"
                  class="watt-text-m watt-on-light--high-emphasis"
                  [class.closed-down-state]="
                    meteringPoint.connectionState === ConnectionState.ClosedDown
                  "
                >
                  {{ t(meteringPoint.connectionState) }}
                </span>
                <br />
                <span class="watt-on-light--medium-emphasis">
                  @if (meteringPoint.connectionState === ConnectionState.ClosedDown) {
                    {{ meteringPoint.connectionDate | wattDate }} ―
                    {{ meteringPoint.closedDownDate | wattDate }}
                  } @else {
                    {{ meteringPoint.connectionDate | wattDate }}
                  }
                </span>
              </div>

              <div class="grid-cell">
                @if (meteringPointId() === meteringPoint.identification) {
                  <watt-badge type="success">{{
                    'meteringPoint.selectedRelatedMeteringPoint' | transloco
                  }}</watt-badge>
                } @else {
                  <watt-icon name="right" />
                }
              </div>
            </div>
          }
        </div>

        <!-- <watt-table [columns]="columns" [dataSource]="dataSource" [hideColumnHeaders]="true">
          <ng-container *wattTableCell="columns.name; let meteringPoint">
            <div class="watt-space-inset-s">
              <span class="watt-text-m watt-on-light--high-emphasis">
                {{ 'meteringPointType.' + meteringPoint.type | transloco }}
              </span>
              <br />
              <span class="watt-on-light--medium-emphasis">
                {{ meteringPoint.identification }}
              </span>
            </div>
          </ng-container>

          <ng-container *wattTableCell="columns.status; let meteringPoint">
            <span
              *transloco="let t; prefix: 'meteringPoint.overview.status'"
              class="watt-text-m watt-on-light--high-emphasis"
            >
              {{ t(meteringPoint.connectionState) }}
            </span>
            <br />
            <span class="watt-on-light--medium-emphasis">
              @if (meteringPoint.connectionState === ConnectionState.ClosedDown) {
                {{ meteringPoint.connectionDate | wattDate }} ―
                {{ meteringPoint.closedDownDate | wattDate }}
              } @else {
                {{ meteringPoint.connectionDate | wattDate }}
              }
            </span>
          </ng-container>

          <ng-container *wattTableCell="columns.indicator; let meteringPoint">
            @if (meteringPointId() === meteringPoint.identification) {
              <watt-badge type="success">{{
                'meteringPoint.selectedRelatedMeteringPoint' | transloco
              }}</watt-badge>
            } @else {
              <watt-icon name="right" />
            }
          </ng-container>
        </watt-table> -->
      </dh-result>
    </watt-card>
  `,
})
export class DhRelatedMeteringPointsV2Component {
  query = query(GetRelatedMeteringPointsByIdDocument, () => ({
    variables: { meteringPointId: this.meteringPointId() },
  }));

  private maybeRelatedMeteringPoints = computed(() => this.query.data()?.relatedMeteringPoints);

  meteringPointId = input.required<string>();

  ConnectionState = ConnectionState;

  showHistorical = signal(false);

  relatedMeteringPointsList = computed(() => {
    const relatedMeteringPoints = this.maybeRelatedMeteringPoints();

    if (!relatedMeteringPoints) return [];

    return [
      ...(relatedMeteringPoints.parent ? [relatedMeteringPoints.parent] : []),
      ...(relatedMeteringPoints.current ? [relatedMeteringPoints.current] : []),
      ...(relatedMeteringPoints.relatedMeteringPoints ?? []),
      ...(relatedMeteringPoints.relatedByGsrn ?? []),
      // Historical
      ...(this.showHistorical() ? (relatedMeteringPoints.historicalMeteringPoints ?? []) : []),
      ...(this.showHistorical()
        ? (relatedMeteringPoints.historicalMeteringPointsByGsrn ?? [])
        : []),
    ];
  });

  hasHistorical = computed(() => {
    const relatedMeteringPoints = this.maybeRelatedMeteringPoints();

    if (!relatedMeteringPoints) return false;

    return (
      relatedMeteringPoints.historicalMeteringPoints?.length > 0 ||
      relatedMeteringPoints.historicalMeteringPointsByGsrn?.length > 0
    );
  });

  dataSource = new WattTableDataSource<RelatedMeteringPointDto>();

  columns: WattTableColumnDef<RelatedMeteringPointDto> = {
    name: { accessor: null },
    status: { accessor: null },
    indicator: { accessor: null, align: 'right' },
  };

  constructor() {
    effect(() => (this.dataSource.data = this.relatedMeteringPointsList()));
  }

  toggleHistorical() {
    this.showHistorical.update((value) => !value);
  }

  getLink = (path: MeteringPointSubPaths, id: string) =>
    combineWithIdPaths('metering-point', id, path);
}
