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
import { RouterOutlet } from '@angular/router';
import { input, inject, computed, Component, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';

import {
  WattProgressTrackerComponent,
  WattProgressTrackerStepComponent,
} from '@energinet/watt/progress-tracker';

import { WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet/watt/drawer';
import { VaterFlexComponent } from '@energinet/watt/vater';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetProcessByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

import { DhCalculationsDetailsGridAreasComponent } from './gridareas.component';

@Component({
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,

    VaterFlexComponent,
    WATT_DRAWER,
    WattDatePipe,
    WattButtonComponent,
    WattProgressTrackerComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattProgressTrackerStepComponent,

    DhResultComponent,
    DhProcessStateBadge,
    DhEmDashFallbackPipe,
    DhCalculationsDetailsGridAreasComponent,
  ],
  selector: 'dh-process-details',
  template: `
    @let process = result();
    @let calculation = calculationDetails();
    @let energyTimeSeriesRequest = energyTimeSeriesRequestDetails();
    @let wholesaleRequest = wholesaleRequestDetails();

    <watt-drawer
      autoOpen
      [key]="id()"
      *transloco="let t; prefix: 'devExamples.processes'"
      (closed)="navigation.navigate('list')"
    >
      <watt-drawer-topbar>
        @if (process) {
          <dh-process-state-badge [status]="process.state">
            {{ 'shared.states.' + process.state | transloco }}
          </dh-process-state-badge>
        }
      </watt-drawer-topbar>
      <watt-drawer-actions>
        <watt-button variant="secondary" (click)="navigation.navigate('edit', process?.id)">
          {{ t('edit.editButtonTitle') }}
        </watt-button>
      </watt-drawer-actions>
      <watt-drawer-heading>
        <h2>
          @if (loading()) {
            {{ t('loading') }}
          } @else if (calculationType()) {
            {{ t('calculationTypes.' + calculationType()) }}
          } @else {
            {{ t('request') }}
          }
        </h2>
        <watt-description-list [groupsPerRow]="3">
          <watt-description-list-item
            [label]="t('details.startedBy')"
            [value]="process?.createdBy?.displayName | dhEmDashFallback"
          />
          <watt-description-list-item
            [label]="t('details.executionTime')"
            [value]="startedAtOrScheduledAt() | wattDate: 'long' | dhEmDashFallback"
          />

          <watt-description-list-item [label]="t('details.processId')" [value]="id()" />

          <watt-description-list-item
            [label]="t('details.period')"
            [value]="period() | wattDate: 'short' | dhEmDashFallback"
          />

          @if (calculation) {
            <watt-description-list-item
              [label]="t('details.executionType')"
              [value]="t('executionTypes.' + calculation.executionType)"
            />
          }

          @if (energyTimeSeriesRequest) {
            <watt-description-list-item
              [label]="t('details.meteringPointType')"
              [value]="t('meteringPointTypes.' + energyTimeSeriesRequest.meteringPointType)"
            />
          }

          @if (wholesaleRequest) {
            <watt-description-list-item
              [label]="t('details.priceType')"
              [value]="t('priceTypes.' + wholesaleRequest.priceType)"
            />
          }
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-content>
        <dh-result [hasError]="hasError()" [loading]="loading()">
          <vater-flex fill="both" gap="l">
            @if (calculation) {
              <watt-progress-tracker>
                @for (step of calculation.steps; track step; let i = $index) {
                  <watt-progress-tracker-step
                    [label]="'wholesale.calculations.steps.' + i + '.pending' | transloco"
                    [status]="step.state"
                    [current]="step.isCurrent"
                  >
                    {{ 'wholesale.calculations.steps.' + i + '.succeeded' | transloco }}
                  </watt-progress-tracker-step>
                }
              </watt-progress-tracker>
              @if (calculation.gridAreas) {
                <vater-flex fill="vertical">
                  <dh-calculation-details-grid-areas [gridAreas]="calculation.gridAreas" />
                </vater-flex>
              }
            }
          </vater-flex>
        </dh-result>
      </watt-drawer-content>
    </watt-drawer>
    <router-outlet />
  `,
})
export class DhProcessDetailsComponent {
  navigation = inject(DhNavigationService);
  drawer = viewChild(WattDrawerComponent);

  // Param value
  id = input.required<string>();

  private processQuery = query(GetProcessByIdDocument, () => ({
    variables: { id: this.id() },
  }));

  loading = this.processQuery.loading;
  hasError = this.processQuery.hasError;

  result = computed(() => this.processQuery.data()?.processById);
  startedAtOrScheduledAt = computed(() => this.result()?.startedAt ?? this.result()?.scheduledAt);

  calculationDetails = computed(() => {
    const result = this.result();
    return result?.__typename === 'WholesaleAndEnergyCalculation' ? result : null;
  });

  energyTimeSeriesRequestDetails = computed(() => {
    const result = this.result();
    return result?.__typename === 'RequestCalculatedEnergyTimeSeriesResult' ? result : null;
  });

  wholesaleRequestDetails = computed(() => {
    const result = this.result();
    return result?.__typename === 'RequestCalculatedWholesaleServicesResult' ? result : null;
  });

  period = computed(() => {
    const result = this.result();
    return result && 'period' in result ? result.period : null;
  });

  calculationType = computed(() => {
    const result = this.result();
    return result && 'calculationType' in result ? result.calculationType : null;
  });
}
