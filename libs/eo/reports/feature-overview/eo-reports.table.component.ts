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
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect, EventEmitter,
  inject,
  input,
  OnInit, Output,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { translations } from '@energinet-datahub/eo/translations';
import { EoReport, ReportStatus } from '@energinet-datahub/eo/reports/data-access-api';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WattIconComponent } from '@energinet/watt/icon';

@Component({
  selector: 'eo-reports-table',
  imports: [
    CommonModule,
    WattTableComponent,
    WattTableCellDirective,
    WattButtonComponent,
    WattDatePipe,
    WattBadgeComponent,
    TranslocoPipe,
    WattDataTableComponent,
    VaterUtilityDirective,
    WattIconComponent,
  ],
  styles: [``],
  template: `
    <watt-data-table
      vater
      inset="m"
      [error]="error()"
      [autoSize]="true"
      [enableEmptyState]="true"
      [enableSearch]="false"
      [enablePaginator]="false"
    >
      <h3>{{ translations.reports.overview.title | transloco }}</h3>
      <watt-button variant="secondary" (click)="requestNewReport.emit()">
        <span>{{ translations.reports.overview.newReport | transloco }}</span>
        <watt-icon name="plus" />
      </watt-button>

      <watt-table
        #table
        [loading]="loading()"
        [columns]="columns"
        [dataSource]="dataSource"
        sortBy="createdAt"
        sortDirection="desc"
      >
        <ng-container *wattTableCell="columns.createdAt; let report">
          <span>{{ report.createdAt | wattDate }}</span>
        </ng-container>
        <ng-container *wattTableCell="columns.status; let report">
          @if (report.status === PENDING_STATUS) {
            <watt-badge type="info"
              >{{ translations.reports.overview.table.status.pending | transloco }}
            </watt-badge>
          }
          @if (report.status === COMPLETED_STATUS) {
            <watt-button (click)="downloadReport.emit(report)" size="small" variant="secondary">
              <span>{{ translations.reports.overview.table.download | transloco }}</span>
            </watt-button>
          }
          @if (report.status === FAILED_STATUS) {
            <watt-badge type="danger"
              >{{ translations.reports.overview.table.status.failed | transloco }}
            </watt-badge>
          }
        </ng-container>
        <ng-container *wattTableCell="columns.download; let report">
          @if (report && report.status === COMPLETED_STATUS) {}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class EoReportsTableComponent implements OnInit {
  public loading = input(true);
  public reports = input<EoReport[]>([]);
  public error = input<string | null>(null);
  public table = viewChild(WattTableComponent);
  public requestNewReport = output<void>();
  public downloadReport = output<EoReport>();

  protected readonly PENDING_STATUS: ReportStatus = 'Pending';
  protected readonly COMPLETED_STATUS: ReportStatus = 'Completed';
  protected readonly FAILED_STATUS: ReportStatus = 'Failed';

  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      // Clear selection when permissions change
      this.table()?.clearSelection();

      this.dataSource.data = this.reports();
    });
  }

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
      });
  }

  protected dataSource: WattTableDataSource<EoReport> = new WattTableDataSource(undefined);
  protected columns!: WattTableColumnDef<EoReport>;
  protected readonly translations = translations;

  private setColumns(): void {
    this.columns = {
      createdAt: {
        accessor: 'createdAt',
        header: `${this.transloco.translate(translations.reports.overview.table.createdAtTitle)}`,
      },
      status: {
        accessor: 'status',
        header: `${this.transloco.translate(translations.reports.overview.table.statusTitle)}`,
        size: 'min-content',
      },
    };

    this.cd.detectChanges();
  }
}
