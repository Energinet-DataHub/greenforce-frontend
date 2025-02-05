import { afterRenderEffect, Component, computed, input, viewChild } from '@angular/core';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetProcessDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { TranslocoDirective } from '@ngneat/transloco';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import type { DhProcessCalculation } from './types';
import { DhCalculationDetailsComponent } from './calculation-details.component';

@Component({
  imports: [
    WATT_DRAWER,
    TranslocoDirective,
    DhProcessStateBadge,
    WattDescriptionListItemComponent,
    WattDescriptionListComponent,
    DhEmDashFallbackPipe,
    WattDatePipe,
    DhCalculationDetailsComponent,
  ],
  selector: 'dh-process-details',
  template: `
    @let process = result();

    <watt-drawer *transloco="let t; read: 'devExamples.calculations'" [loading]="loading()">
      <watt-drawer-topbar>
        @if (process) {
          <dh-process-state-badge [status]="process.state">
            {{ t('states.' + process.state) }}
          </dh-process-state-badge>
        }
      </watt-drawer-topbar>
      <watt-drawer-heading>
        <div class="headline-container">
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

          <watt-description-list-item
            [label]="t('details.processId')"
            [value]="id() | dhEmDashFallback"
          />
          @let calculation = calculationDetails();
          @if (calculation) {
            <dh-calculation-details [details]="calculation" />
          }
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-content>
        <h1>{{ id() }}</h1>
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhProcessDetailsComponent {
  private processQuery = lazyQuery(GetProcessDocument);

  loading = this.processQuery.loading;
  error = this.processQuery.error;
  result = computed(() => this.processQuery.data()?.processById);
  startedAtOrScheduledAt = computed(() => this.result()?.scheduledAt ?? this.result()?.scheduledAt);

  calculationDetails = computed(() =>
    this.result() && this.result()?.__typename === 'Calculation'
      ? (this.result() as DhProcessCalculation)
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
}
