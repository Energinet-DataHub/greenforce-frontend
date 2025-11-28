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
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

import { WATT_CARD } from '@energinet/watt/card';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattDatePipe } from '@energinet/watt/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { combineWithIdPaths, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import {
  ConnectionState,
  GetRelatedMeteringPointsByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-related-metering-points',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterSpacerComponent,
    WATT_CARD,
    WattDatePipe,
    WattButtonComponent,
    WattIconComponent,
    DhResultComponent,
  ],
  styles: `
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr 140px;
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }

    .closed-down-state {
      color: var(--watt-color-state-danger);
    }

    .dh-one-time-badge {
      background-color: var(--watt-color-primary);
      border-radius: var(--watt-space-xs);
      color: var(--watt-color-neutral-white);
      display: inline-flex;
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
            <div class="grid-row" [routerLink]="getLink('master-data', meteringPoint.id)">
              <div class="grid-cell">
                <span class="watt-text-m watt-on-light--high-emphasis">
                  {{ 'meteringPointType.' + meteringPoint.type | transloco }}
                </span>
                <br />
                <span class="watt-text-s watt-on-light--medium-emphasis">
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
                <span class="watt-text-s watt-on-light--medium-emphasis">
                  @switch (meteringPoint.connectionState) {
                    @case ('NEW') {
                      {{ meteringPoint.createdDate | wattDate }}
                    }
                    @case ('CONNECTED') {
                      {{ meteringPoint.connectionDate | wattDate }}
                    }
                    @case ('CLOSED_DOWN') {
                      {{ meteringPoint.closedDownDate | wattDate }}
                    }
                    @default {
                      {{ meteringPoint.createdDate | wattDate }}
                    }
                  }
                </span>
              </div>

              <div class="grid-cell">
                @if (meteringPointId() === meteringPoint.identification) {
                  <span class="dh-one-time-badge watt-label watt-space-inset-squish-xs">
                    {{ 'meteringPoint.selectedRelatedMeteringPoint' | transloco }}
                  </span>
                } @else {
                  <watt-icon name="right" />
                }
              </div>
            </div>
          }
        </div>
      </dh-result>
    </watt-card>
  `,
})
export class DhRelatedMeteringPointsComponent {
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

  toggleHistorical() {
    this.showHistorical.update((value) => !value);
  }

  getLink = (path: MeteringPointSubPaths, id: string) =>
    combineWithIdPaths('metering-point', id, path);
}
