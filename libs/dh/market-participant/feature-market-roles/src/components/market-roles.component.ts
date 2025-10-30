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
import { AfterViewInit, Component, inject } from '@angular/core';
import { translate, TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';

import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet/watt/table';
import { WATT_CARD } from '@energinet/watt/card';
import { WattButtonComponent } from '@energinet/watt/button';
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';

@Component({
  selector: 'dh-market-roles',
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
  templateUrl: './market-roles.component.html',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    WATT_CARD,
    WATT_TABLE,
    WattButtonComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattButtonComponent,
  ],
})
export class DhMarketRolesComponent implements AfterViewInit {
  private transloco = inject(TranslocoService);

  dataSource = new WattTableDataSource(Object.keys(EicFunction));
  private generateCSV = GenerateCSV.fromWattTableDataSource(this.dataSource);

  columns: WattTableColumnDef<string> = {
    name: { accessor: (value) => value },
    description: { accessor: null },
  };

  ngAfterViewInit() {
    this.dataSource.sortingDataAccessor = (data, header) =>
      header === 'name'
        ? translate('marketParticipant.marketRoles.' + data)
        : translate('marketParticipant.marketRoleDescriptions.' + data);

    if (this.dataSource.sort) {
      this.dataSource.data = this.dataSource.sortData(this.dataSource.data, this.dataSource.sort);
    }
  }

  download() {
    this.transloco
      .selectTranslateObject('marketParticipant')
      .pipe(take(1))
      .subscribe((translations) => {
        const basePath = 'marketParticipant.marketRolesOverview.columns';

        this.generateCSV
          .addHeaders([
            `"${translate(basePath + '.name')}"`,
            `"${translate(basePath + '.description')}"`,
          ])
          .mapLines((x) =>
            x.map((x) => [
              `"${translations['marketRoles'][x]}"`,
              `"${translations['marketRoleDescriptions'][x]}"`,
            ])
          )
          .generate('marketParticipant.marketRolesOverview.fileName');
      });
  }
}
