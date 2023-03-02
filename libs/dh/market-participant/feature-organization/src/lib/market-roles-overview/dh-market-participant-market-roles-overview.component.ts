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
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { EicFunction } from '@energinet-datahub/dh/shared/domain';
import { exportCsv } from '@energinet-datahub/dh/shared/ui-util';
import { take } from 'rxjs';

@Component({
  selector: 'dh-market-participant-market-roles-overview',
  styleUrls: ['dh-market-participant-market-roles-overview.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-market-roles-overview.component.html',
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    DhSharedUiPaginatorComponent,
    MatTooltipModule,
    TranslocoModule,
    WattButtonModule,
    WattIconModule,
    WattCardModule,
  ],
})
export class DhMarketParticipantMarketRolesOverviewComponent implements AfterViewInit {
  constructor(private trans: TranslocoService) {}

  dataSource = new WattTableDataSource<string>(Object.keys(EicFunction));

  columns: WattTableColumnDef<string> = {
    name: { accessor: 'valueOf' },
    description: { accessor: 'valueOf' },
  };

  translateHeader(key: string) {
    return translate(`marketParticipant.marketRolesOverview.columns.${key}`);
  }

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (data, header) =>
      header === 'name'
        ? translate('marketParticipant.marketRoles.' + data)
        : translate('marketParticipant.marketRoleDescriptions.' + data);

    if (this.dataSource.sort)
      this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.dataSource.sort);
  }

  download() {
    this.trans
      .selectTranslateObject('marketParticipant')
      .pipe(take(1))
      .subscribe((translations) => {
        const basePath = 'marketParticipant.marketRolesOverview.columns.';

        const headers = [translate(basePath + 'name'), translate(basePath + 'description')];

        if (this.dataSource.sort) {
          const marketRoles = this.dataSource.sortData(
            this.dataSource.filteredData,
            this.dataSource.sort
          );

          const lines = marketRoles.map((x) => [
            translations['marketRoles'][x],
            translations['marketRoleDescriptions'][x],
          ]);

          exportCsv(headers, lines);
        }
      });
  }
}
