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
import { HttpClient } from '@angular/common/http';
import { Component, inject, computed } from '@angular/core';

import { switchMap } from 'rxjs';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableComponent } from '@energinet-datahub/watt/table';
import { WattDataActionsComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe, streamToFile } from '@energinet-datahub/dh/shared/ui-util';
import { GetBalanceResponsibleMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { BalanceResponsibleMessage } from './types';
import { DhBalanceResponsibleImporterComponent } from './file-uploader/dh-balance-responsible-importer.component';
import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-balance-responsible',
  templateUrl: './dh-balance-responsible.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }
    `,
  ],
  providers: [DhNavigationService],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattDatePipe,
    WattBadgeComponent,
    WattTableComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataActionsComponent,

    VaterUtilityDirective,

    DhEmDashFallbackPipe,
    DhBalanceResponsibleImporterComponent,
  ],
})
export class DhBalanceResponsibleComponent {
  private toastService = inject(WattToastService);
  private httpClient = inject(HttpClient);
  navigation = inject(DhNavigationService);

  dataSource = new GetBalanceResponsibleMessagesDataSource({
    variables: { order: { validFrom: SortEnumType.Desc } },
  });

  columns: WattTableColumnDef<BalanceResponsibleMessage> = {
    received: { accessor: 'receivedDateTime' },
    electricitySupplier: { accessor: null },
    balanceResponsible: { accessor: null },
    gridArea: { accessor: null },
    meteringPointType: { accessor: null },
    validFrom: { accessor: null },
    validTo: { accessor: null },
  };

  url = computed(() => this.dataSource.query.data()?.balanceResponsible?.balanceResponsiblesUrl);
  importUrl = computed(
    () => this.dataSource.query.data()?.balanceResponsible?.balanceResponsibleImportUrl
  );

  isLoading = false;
  isDownloading = false;
  hasError = false;

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  download(url: string | undefined | null): void {
    if (!url) return;

    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'eSett-balance-responsible-messages',
      type: 'text/csv',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
