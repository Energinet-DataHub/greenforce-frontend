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
  ExchangeEventSortProperty,
  SortDirection,
} from '@energinet-datahub/dh/shared/domain/graphql';

type InType = Observable<Sort>;

type OutType = Observable<{
  sortProperty: ExchangeEventSortProperty;
  sortDirection: SortDirection;
}>;

export const dhExchangeSortMetadataMapper = pipe<InType, OutType>(
  map(({ active, direction }) => {
    const sortDirection = direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending;

    let sortProperty: ExchangeEventSortProperty;

    switch (active) {
      case 'id':
        sortProperty = ExchangeEventSortProperty.DocumentId;
        break;
      case 'calculationType':
        sortProperty = ExchangeEventSortProperty.CalculationType;
        break;
      case 'messageType':
        sortProperty = ExchangeEventSortProperty.CalculationType;
        break;
      case 'gridArea':
        sortProperty = ExchangeEventSortProperty.GridAreaCode;
        break;
      case 'status':
        sortProperty = ExchangeEventSortProperty.DocumentStatus;
        break;
      case 'created':
      default:
        sortProperty = ExchangeEventSortProperty.Created;
        break;
    }

    return { sortProperty, sortDirection };
  })
);
