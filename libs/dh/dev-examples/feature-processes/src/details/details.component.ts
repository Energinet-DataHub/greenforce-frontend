import { afterRenderEffect, Component, computed, inject, input, viewChild } from '@angular/core';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetProcessDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhEmDashFallbackPipe, DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import type {
  DhProcessCalculation,
  DhProcessEnergyTimeSeriesRequest,
  DhProcessWholesaleRequest,
} from '../types';
import { DhCalculationsDetailsGridAreasComponent } from './gridareas.component';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import {
  WattProgressTrackerComponent,
  WattProgressTrackerStepComponent,
} from '@energinet-datahub/watt/progress-tracker';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
  imports: [
    WATT_DRAWER,
    TranslocoDirective,
    TranslocoPipe,
    DhProcessStateBadge,
    WattDescriptionListItemComponent,
    WattDescriptionListComponent,
    DhEmDashFallbackPipe,
    WattDatePipe,
    DhResultComponent,
    VaterFlexComponent,
    WattProgressTrackerComponent,
    WattProgressTrackerStepComponent,
    DhCalculationsDetailsGridAreasComponent,
  ],
  selector: 'dh-process-details',
  styles: `
    .headline {
      display: inline-block;
      padding-right: var(--watt-space-s);
    }

    dh-calculation-details-grid-areas {
      margin: 0 var(--watt-space-ml);
    }

    watt-progress-tracker {
      margin: 0 var(--watt-space-ml);
    }
  `,
  template: `
    @let process = result();
    @let calculation = calculationDetails();
    @let energyTimeSeriesRequest = energyTimeSeriesRequestDetails();
    @let wholesaleRequest = wholesaleRequestDetails();

    <watt-drawer *transloco="let t; read: 'devExamples.processes'" (closed)="closed()">
      <watt-drawer-topbar>
        @if (process) {
          <dh-process-state-badge [status]="process.state">
            {{ 'shared.states.' + process.state | transloco }}
          </dh-process-state-badge>
        }
      </watt-drawer-topbar>
      <watt-drawer-heading>
        <div>
          <h3 class="headline watt-headline-2">
            {{ t('calculationTypes.' + (process?.calculationType ?? 'UNKNOWN')) }}
          </h3>
        </div>
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
            [value]="process?.period | wattDate: 'short' | dhEmDashFallback"
          />

          @if (calculation) {
            <watt-description-list-item
              [label]="t('details.executionType')"
              [value]="'shared.executionTypes.' + calculation.executionType | transloco"
            />
          }

          @if (energyTimeSeriesRequest) {
            <watt-description-list-item
              [label]="t('details.meteringPointType')"
              [value]="t('meteringPointType.' + energyTimeSeriesRequest.meteringPointType)"
            />
          }

          @if (wholesaleRequest) {
            <watt-description-list-item
              [label]="t('details.priceType')"
              [value]="t('priceType.' + wholesaleRequest.priceType)"
            />
          }
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-content>
        <dh-result [hasError]="hasError()" [loading]="loading()">
          <vater-flex fill="vertical" gap="l" offset="l">
            @if (process) {
              <watt-progress-tracker>
                @for (step of process.steps; track step; let i = $index) {
                  <watt-progress-tracker-step
                    [label]="'shared.steps.' + i + '.pending' | transloco"
                    [status]="step.state"
                    [current]="step.isCurrent"
                  >
                    {{ 'shared.steps.' + i + '.succeeded' | transloco }}
                  </watt-progress-tracker-step>
                }
              </watt-progress-tracker>
            }
            <vater-flex scrollable fill="vertical" grow="0">
              @if (calculation) {
                <dh-calculation-details-grid-areas [gridAreas]="calculation.gridAreas" />
              }
            </vater-flex>
          </vater-flex>
        </dh-result>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhProcessDetailsComponent {
  private navigation = inject(DhNavigationService);
  private processQuery = lazyQuery(GetProcessDocument);

  loading = this.processQuery.loading;
  hasError = this.processQuery.hasError;
  result = computed(() => this.processQuery.data()?.processById);
  startedAtOrScheduledAt = computed(() => this.result()?.scheduledAt ?? this.result()?.scheduledAt);

  calculationDetails = computed(() =>
    this.result() && this.result()?.__typename === 'Calculation'
      ? (this.result() as DhProcessCalculation)
      : null
  );

  energyTimeSeriesRequestDetails = computed(() =>
    this.result() && this.result()?.__typename === 'RequestCalculatedEnergyTimeSeriesResult'
      ? (this.result() as DhProcessEnergyTimeSeriesRequest)
      : null
  );

  wholesaleRequestDetails = computed(() =>
    this.result()?.__typename === 'RequestCalculatedWholesaleServicesResult'
      ? (this.result() as DhProcessWholesaleRequest)
      : null
  );

  // Param value
  id = input.required<string>();
  drawer = viewChild(WattDrawerComponent);

  constructor() {
    afterRenderEffect(() => {
      this.processQuery.query({ variables: { id: this.id() } });
      this.drawer()?.open();
    });
  }

  closed() {
    this.navigation.navigate('list');
  }
}
