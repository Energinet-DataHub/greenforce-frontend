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
import { Component, inject, computed, signal } from '@angular/core';

import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet/watt/date';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableComponent } from '@energinet/watt/table';
import { WattDataActionsComponent, WattDataTableComponent } from '@energinet/watt/data';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { GetBalanceResponsibleMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { BalanceResponsibleMessage } from './types';
import { DhBalanceResponsibleImporterComponent } from './file-uploader/dh-balance-responsible-importer.component';
import { SortDirection } from '@energinet-datahub/dh/shared/domain/graphql';
import { RouterOutlet } from '@angular/router';

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
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
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
    VaterStackComponent,
  ],
})
export class DhBalanceResponsibleComponent {
  navigation = inject(DhNavigationService);

  dataSource = new GetBalanceResponsibleMessagesDataSource({
    variables: {
      locale: translate<string>('selectedLanguageIso'),
      order: { receivedDate: SortDirection.Desc },
    },
  });

  columns: WattTableColumnDef<BalanceResponsibleMessage> = {
    receivedDate: { accessor: 'receivedDateTime' },
    electricitySupplier: { accessor: null },
    balanceResponsible: { accessor: null },
    gridArea: { accessor: null },
    meteringPointType: { accessor: null },
    validFrom: { accessor: null },
    validTo: { accessor: null },
  };

  url = computed(
    () => this.dataSource.query.data()?.balanceResponsible?.balanceResponsiblesUrl ?? ''
  );

  private generateCSV = GenerateCSV.fromStream(() => this.url());

  importUrl = computed(
    () => this.dataSource.query.data()?.balanceResponsible?.balanceResponsibleImportUrl
  );

  isDownloading = signal(false);

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  async download() {
    this.isDownloading.set(true);

    await this.generateCSV.generate('eSett.balanceResponsible.fileName');

    this.isDownloading.set(false);
  }
}
