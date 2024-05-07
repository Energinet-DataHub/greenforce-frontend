import { Component, input } from '@angular/core';
import { SettlementReportStatusType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'dh-settlement-reports-status',
  template: `<ng-container *transloco="let t; read: 'wholesale.settlementReportsV2.reportStatus'">
    @switch (status()) {
      @case ('IN_PROGRESS') {
        <watt-badge type="info">{{ t(status()) }}</watt-badge>
      }
      @case ('ERROR') {
        <watt-badge type="warning">{{ t(status()) }}</watt-badge>
      }
      @case ('COMPLETED') {
        <watt-badge type="success">{{ t(status()) }}</watt-badge>
      }
    }
  </ng-container>`,
  imports: [WattBadgeComponent, TranslocoDirective],
})
export class DhSettlementReportsStatusComponent {
  status = input.required<SettlementReportStatusType>();
}
