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
import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

interface Actor {
  glnOrEic: string;
  name: string;
  marketRole: string;
  status: string;
}

@Component({
  standalone: true,
  selector: 'dh-actors-overview',
  templateUrl: './dh-actors-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [TranslocoModule, WATT_TABLE, WATT_CARD],
})
export class DhActorsOverviewComponent {
  dataSource = new WattTableDataSource<Actor>([]);

  columns: WattTableColumnDef<Actor> = {
    glnOrEic: { accessor: 'glnOrEic' },
    name: { accessor: 'name' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };
}
