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
import { EttReportsTableComponent } from './ett-reports.table.component';
import { EttReport, EttReportsService } from '@energinet-datahub/ett/reports/data-access-api';
import { EttStartReportGenerationModalComponent } from './ett-start-report-generation.modal.component';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { translations } from '@energinet-datahub/ett/translations';

@Component({
  selector: 'ett-reports',
  imports: [CommonModule, EttReportsTableComponent],
  template: ` <ett-reports-table
    [loading]="reportService.loading()"
    [reports]="reportService.reports()"
    [error]="reportService.error()"
    (requestNewReport)="openStartReportModal()"
    (downloadReport)="downloadReport($event)"
  />`,
})
export class EttReportsOverviewComponent implements OnInit {
  loading = signal(true);

  protected readonly translations = translations;

  protected reportService = inject(EttReportsService);
  private modalService = inject(WattModalService);

  ngOnInit(): void {
    this.reportService.startPolling();
  }

  openStartReportModal() {
    this.modalService.open({
      component: EttStartReportGenerationModalComponent,
    });
  }

  downloadReport(report: EttReport) {
    this.reportService.downloadReport(report);
  }
}
