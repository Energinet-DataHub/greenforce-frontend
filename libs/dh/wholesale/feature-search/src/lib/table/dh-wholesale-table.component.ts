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
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { take } from 'rxjs';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { graphql, WholesaleBatchHttp } from '@energinet-datahub/dh/shared/domain';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

type Batch = Omit<graphql.Batch, 'gridAreas'>;
type wholesaleTableData = WattTableDataSource<Batch>;

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    DhSharedUiDateTimeModule,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonModule,
    WattEmptyStateModule,
    WattPaginatorComponent,
    WattCardModule,
  ],
  selector: 'dh-wholesale-table',
  templateUrl: './dh-wholesale-table.component.html',
  styleUrls: ['./dh-wholesale-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleTableComponent {
  private document = inject(DOCUMENT);
  private httpClient = inject(WholesaleBatchHttp);
  private toastService = inject(WattToastService);
  private translations = inject(TranslocoService);

  @Input()
  selectedBatch?: Batch;

  @Input() set data(batches: Batch[]) {
    this._data = new WattTableDataSource(batches);
  }

  @Output() selectedRow: EventEmitter<Batch> = new EventEmitter();

  _data: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Batch> = {
    periodFrom: { accessor: (batch) => batch.period?.start },
    periodTo: { accessor: (batch) => batch.period?.end },
    executionTime: { accessor: 'executionTimeStart' },
    processType: { accessor: 'processType' },
    status: { accessor: 'executionState' },
    basisData: { accessor: 'isBasisDataDownloadAvailable' },
  };

  translateHeader = (key: string) => translate(`wholesale.searchBatch.columns.${key}`);

  onDownload(event: Event, batch: Batch) {
    event.stopPropagation();
    this.httpClient
      .v1WholesaleBatchZippedBasisDataStreamGet(batch.id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          const blobPart = data as unknown as BlobPart;
          const blob = new Blob([blobPart], { type: 'application/zip' });
          const basisData = window.URL.createObjectURL(blob);
          const link = this.document.createElement('a');
          link.href = basisData;
          link.download = `${batch.id}.zip`;
          link.click();
          link.remove();
        },
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: this.translations.translate('wholesale.searchBatch.downloadFailed'),
          });
        },
      });
  }
}
