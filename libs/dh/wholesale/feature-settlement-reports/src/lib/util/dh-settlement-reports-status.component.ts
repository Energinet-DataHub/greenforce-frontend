import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { SettlementReportStatusType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  standalone: true,
  selector: 'dh-settlement-reports-status',
  template: `<ng-container *transloco="let t; read: 'wholesale.settlementReports.reportStatus'">
    @switch (status()) {
      @case ('IN_PROGRESS') {
        <watt-badge type="info">{{ t(status()) }}</watt-badge>
      }
      @case ('ERROR') {
        <watt-badge type="warning">{{ t(status()) }}</watt-badge>
      }
      @case ('COMPLETED') {
        <watt-button
          type="button"
          variant="text"
          icon="fileDownload"
          (click)="download.emit($event)"
          >{{ t('download') }}</watt-button
        >
      }
      @case ('CANCELED') {
        <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
      }
    }
  </ng-container>`,
  imports: [WattBadgeComponent, TranslocoDirective, WattButtonComponent, DecimalPipe],
})
export class DhSettlementReportsStatusComponent {
  status = input.required<SettlementReportStatusType>();

  download = output<Event>();
}
