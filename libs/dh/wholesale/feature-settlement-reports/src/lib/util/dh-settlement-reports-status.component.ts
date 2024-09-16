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
        <watt-badge type="info">{{
          t(status(), { progress: progress() | number: '1.2-2' })
        }}</watt-badge>
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
    }
  </ng-container>`,
  imports: [WattBadgeComponent, TranslocoDirective, WattButtonComponent, DecimalPipe],
})
export class DhSettlementReportsStatusComponent {
  status = input.required<SettlementReportStatusType>();
  progress = input.required<number>();

  download = output<Event>();
}
