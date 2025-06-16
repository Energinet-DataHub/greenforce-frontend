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
import { Component, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeasurementsReportsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhNewReportRequest } from './new-report-request.component';
import { DhOverview } from './overview/overview.component';

@Component({
  selector: 'dh-measurements-reports',
  imports: [
    TranslocoDirective,
    WATT_CARD,

    VaterStackComponent,
    VaterFlexComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    DhNewReportRequest,
    DhOverview,
  ],
  styles: `
    :host {
      display: block;
    }

    h3 {
      margin: 0;
    }
  `,
  template: `
    <watt-card vater inset="ml" *transloco="let t; read: 'reports.measurementsReports'">
      @if (isLoading()) {
        <vater-stack fill="vertical" justify="center">
          <watt-spinner />
        </vater-stack>
      } @else {
        @if (totalCount() === 0) {
          <vater-stack fill="vertical" justify="center" gap="l">
            <watt-empty-state
              [icon]="hasError() ? 'custom-power' : 'custom-no-results'"
              [title]="hasError() ? t('errorTitle') : ''"
              [message]="hasError() ? t('errorMessage') : t('emptyMessage')"
            >
              @if (hasError() === false) {
                <dh-new-report-request />
              }
            </watt-empty-state>
          </vater-stack>
        } @else {
          <vater-flex fill="vertical" gap="ml">
            <vater-stack direction="row" gap="s">
              <h3>{{ t('title') }}</h3>
              <span class="watt-chip-label">{{ totalCount() }}</span>

              <vater-spacer />

              <dh-new-report-request />
            </vater-stack>

            <dh-overview [measurementsReports]="measurementsReports()" />
          </vater-flex>
        }
      }
    </watt-card>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhMeasurementsReports {
  private readonly measurementsReportsQuery = query(GetMeasurementsReportsDocument, {
    fetchPolicy: 'network-only',
  });

  measurementsReports = computed(
    () => this.measurementsReportsQuery.data()?.measurementsReports ?? []
  );
  totalCount = computed(() => this.measurementsReports().length);
  isLoading = this.measurementsReportsQuery.loading;
  hasError = this.measurementsReportsQuery.hasError;
}
