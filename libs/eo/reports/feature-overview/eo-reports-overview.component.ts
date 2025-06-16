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
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { EoReportsTableComponent } from './eo-reports.table.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { EoReport, EoReportsService } from '@energinet-datahub/eo/reports/data-access-api';
import { EoStartReportGenerationModalComponent } from './eo-start-report-generation.modal.component';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { TranslocoPipe } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

@Component({
  selector: 'eo-reports',
  imports: [
    CommonModule,
    WATT_CARD,
    EoReportsTableComponent,
    WattButtonComponent,
    WattIconComponent,
    TranslocoPipe,
    WattValidationMessageComponent,
  ],
  styles: [
    `
      .title-flex {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .validation-message-margin {
        margin-bottom: var(--watt-space-m);
      }
    `,
  ],
  template: ` <watt-card>
    <watt-card-title class="title-flex">
      <h3>{{ translations.reports.overview.title | transloco }}</h3>
      <watt-button variant="secondary" (click)="openStartReportModal()">
        <span>{{ translations.reports.overview.newReport | transloco }}</span>
        <watt-icon name="plus" />
      </watt-button>
    </watt-card-title>
    @if (reportService.error()) {
      <watt-validation-message
        [autoScrollIntoView]="false"
        class="validation-message-margin"
        type="warning"
        icon="warning"
        size="normal"
      >
        {{ 'TODO MASEP TRANSLATE: Der opstod en fejl: ' }}{{ reportService.error() }}'
      </watt-validation-message>
    }
    <eo-reports-table
      [loading]="reportService.loading()"
      [reports]="reportService.reports()"
      (downloadReport)="downloadReport($event)"
    />
  </watt-card>`,
})
export class EoReportsOverviewComponent implements OnInit {
  loading = signal(true);

  protected readonly translations = translations;

  protected reportService = inject(EoReportsService);
  private modalService = inject(WattModalService);

  ngOnInit(): void {
    this.reportService.startPolling();
  }

  openStartReportModal() {
    this.modalService.open({
      component: EoStartReportGenerationModalComponent,
    });
  }

  downloadReport(report: EoReport) {
    this.reportService.downloadReport(report);
  }
}
