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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

import { Injectable } from '@angular/core';
import { MarketRole } from '@energinet-datahub/dh/market-participant/data-access-api';
import { EditableMarketRoleRow } from './dh-market-participant-actor-market-roles.component';

@Injectable()
export class MarketRoleGroupService {
  readonly groupRows = (rows: EditableMarketRoleRow[]) => {
    const result: MarketRole[] = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const gridAreaId = row.gridArea;

      const gridArea = {
        id: gridAreaId!,
        meteringPointTypes: row.meteringPointTypes!,
      };

      const marketRoleExsits: MarketRole | undefined = result.find(
        (x) => x.marketRole === row.marketRole!
      );

      if (marketRoleExsits) {
        marketRoleExsits.gridAreas.push(gridArea);
        continue;
      }

      const marketRole: MarketRole = {
        comment: row.comment,
        marketRole: row.marketRole!,
        gridAreas: [gridArea],
      };

      result.push(marketRole);
    }

    return result;
  };
}
