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
  effect,
  inject,
  input,
  OnInit,
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
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { translations } from '@energinet-datahub/eo/translations';
import { EoReport, EoReportsService } from '@energinet-datahub/eo/reports/data-access-api';

@Component({
  selector: 'eo-reports-table',
  imports: [CommonModule, WattTableComponent, WattTableCellDirective, WattButtonComponent],
  styles: [``],
  template: ` <watt-table
    #table
    [loading]="loading()"
    [columns]="columns"
    [dataSource]="dataSource"
  >
    <ng-container *wattTableCell="columns.download; let report">
      @if (report.status === 'Ready') {
        <watt-button variant="icon" icon="download" />
      }
    </ng-container>
  </watt-table>`,
})
export class EoReportsTableComponent implements OnInit {
  public loading = input(true);
  public reports = input<EoReport[]>([]);
  public table = viewChild(WattTableComponent);

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
      },
      download: {
        accessor: 'status',
        header: 'TODO MASEP: Download',
      }
    };

    this.cd.detectChanges();
  }
}
