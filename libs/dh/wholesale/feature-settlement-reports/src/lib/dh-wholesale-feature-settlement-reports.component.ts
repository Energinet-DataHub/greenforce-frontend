import { Component, computed } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { query } from '@energinet-datahub/dh/shared/util-apollo';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { GetSettlementReportsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhSettlementReportsTableComponent } from './table/dh-settlement-reports-table.component';
import { DhRequestSettlementReportButtonComponent } from './button/dh-request-settlement-report-button.component';

@Component({
  selector: 'dh-wholesale-feature-settlement-reports',
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_CARD,
    VaterStackComponent,
    VaterFlexComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,

    DhSettlementReportsTableComponent,
    DhRequestSettlementReportButtonComponent,
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
    <watt-card vater inset="ml" *transloco="let t; read: 'wholesale.settlementReports'">
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
                <dh-request-settlement-report-button />
              }
            </watt-empty-state>
          </vater-stack>
        } @else {
          <vater-flex fill="vertical" gap="ml">
            <vater-stack direction="row" gap="s">
              <h3>{{ t('topBarTitle') }}</h3>
              <span class="watt-chip-label">{{ totalCount() }}</span>

              <vater-spacer />

              <dh-request-settlement-report-button />
            </vater-stack>

            <dh-settlement-reports-table [settlementReports]="settlementReports()" />
          </vater-flex>
        }
      }
    </watt-card>
  `,
})
export class DhWholesaleFeatureSettlementReportsComponent {
  private readonly settlementReportsQuery = query(GetSettlementReportsDocument, {
    fetchPolicy: 'network-only',
  });

  settlementReports = computed(() => this.settlementReportsQuery.data()?.settlementReports ?? []);
  totalCount = computed(() => this.settlementReports().length);
  isLoading = this.settlementReportsQuery.loading;
  hasError = this.settlementReportsQuery.hasError;
}
