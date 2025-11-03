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
import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { translate, TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  WattDataTableComponent,
  WattDataActionsComponent,
  WattDataFiltersComponent,
} from '@energinet/watt/data';

import { WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import {
  SortDirection,
  MeteringGridImbalanceValuesToInclude,
  DownloadMeteringGridAreaImbalanceDocument,
  GetMeteringGridAreaImbalanceQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { GetMeteringGridAreaImbalanceDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhMeteringGridAreaImbalance } from '../types';
import { DhMeteringGridAreaImbalanceFiltersComponent } from './filters.component';

type Variables = Partial<GetMeteringGridAreaImbalanceQueryVariables>;

@Component({
  selector: 'dh-metering-gridarea-imbalance',
  templateUrl: './metering-gridarea-imbalance.component.html',
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
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    RouterOutlet,
    WATT_TABLE,
    WattDatePipe,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDataActionsComponent,
    VaterUtilityDirective,
    DhMeteringGridAreaImbalanceFiltersComponent,
    DhEmDashFallbackPipe,
  ],
  providers: [DhNavigationService],
})
export class DhMeteringGridAreaImbalanceComponent {
  query = lazyQuery(DownloadMeteringGridAreaImbalanceDocument);
  private generateCSV = GenerateCSV.fromQueryWithRawResult(
    this.query,
    (x) => x.downloadMeteringGridAreaImbalance
  );

  navigation = inject(DhNavigationService);
  dataSource = new GetMeteringGridAreaImbalanceDataSource({
    variables: {
      order: {
        receivedDateTime: SortDirection.Desc,
      },
      valuesToInclude: MeteringGridImbalanceValuesToInclude.Imbalances,
    },
  });

  columns: WattTableColumnDef<DhMeteringGridAreaImbalance> = {
    documentDateTime: { accessor: 'documentDateTime' },
    receivedDateTime: { accessor: 'receivedDateTime' },
    id: { accessor: 'id' },
    gridArea: { accessor: 'gridArea' },
    period: { accessor: null },
  };

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
  };

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  download() {
    const variables = this.dataSource.query.getOptions().variables;

    if (variables) {
      this.generateCSV
        .addVariables({
          locale: translate('selectedLanguageIso'),
          valuesToInclude:
            variables.valuesToInclude ?? MeteringGridImbalanceValuesToInclude.Imbalances,
          gridAreaCodes: variables.gridAreaCodes,
          calculationPeriod: variables.calculationPeriod,
          created: variables.created,
          documentId: variables.filter,
          order: variables.order,
        })
        .generate('eSett.meteringGridAreaImbalance.fileName');
    }
  }
}
