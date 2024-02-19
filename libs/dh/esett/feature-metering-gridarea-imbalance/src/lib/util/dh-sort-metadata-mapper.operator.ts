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
import { Sort } from '@angular/material/sort';
import { Observable, map, pipe } from 'rxjs';

import {
  MeteringGridAreaImbalanceSortProperty,
  SortDirection,
} from '@energinet-datahub/dh/shared/domain/graphql';

type InType = Observable<Sort>;

type OutType = Observable<{
  sortProperty: MeteringGridAreaImbalanceSortProperty;
  sortDirection: SortDirection;
}>;

export const dhMGASortMetadataMapper = pipe<InType, OutType>(
  map(({ active, direction }) => {
    const sortDirection = direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending;

    let sortProperty: MeteringGridAreaImbalanceSortProperty;

    switch (active) {
      case 'documentDateTime':
        sortProperty = MeteringGridAreaImbalanceSortProperty.DocumentDateTime;
        break;
      case 'receivedDateTime':
        sortProperty = MeteringGridAreaImbalanceSortProperty.ReceivedDateTime;
        break;
      case 'gridArea':
        sortProperty = MeteringGridAreaImbalanceSortProperty.GridAreaCode;
        break;
      case 'id':
      default:
        sortProperty = MeteringGridAreaImbalanceSortProperty.DocumentId;
        break;
    }

    return { sortProperty, sortDirection };
  })
);
