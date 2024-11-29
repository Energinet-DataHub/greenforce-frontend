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
import { Component, computed } from '@angular/core';

import { DhGridAreasOverviewComponent } from '@energinet-datahub/dh/market-participant/grid-areas/overview';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetGridAreaOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhGridAreaRow } from '@energinet-datahub/dh/market-participant/grid-areas/domain';

@Component({
  selector: 'dh-grid-areas-shell',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <dh-grid-areas-overview
      [gridAreas]="rows()"
      [isLoading]="isLoading()"
      [hasError]="hasError()"
    />
  `,
  imports: [DhGridAreasOverviewComponent],
})
export class DhGridAreasShellComponent {
  private gln = new RegExp('^[0-9]+$');
  private getActorsQuery = query(GetGridAreaOverviewDocument);

  isLoading = this.getActorsQuery.loading;
  hasError = this.getActorsQuery.hasError;

  rows = computed<DhGridAreaRow[]>(() => {
    const gridAreas = this.getActorsQuery.data()?.gridAreaOverview ?? [];

    return gridAreas.map((x) => {
      const row: DhGridAreaRow = {
        id: x.id,
        code: x.code,
        actor: x.actorNumber
          ? `${x.actorName} • ${this.gln.test(x.actorNumber) ? 'GLN' : 'EIC'} ${x.actorNumber}`
          : '',
        organization: x.organizationName ?? '',
        status: x.status,
        type: x.type,
        priceArea: x.priceAreaCode,
        period: {
          start: x.validFrom,
          end: x.validTo ?? null,
        },
      };

      return row;
    });
  });
}
