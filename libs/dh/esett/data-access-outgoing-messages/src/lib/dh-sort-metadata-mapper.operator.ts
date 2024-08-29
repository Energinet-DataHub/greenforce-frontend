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

import {
  ExchangeEventSortProperty,
  SortDirection,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type ExchangeEventSort = {
  sortProperty: ExchangeEventSortProperty;
  sortDirection: SortDirection;
};

export function dhExchangeSortMetadataMapper(sort: Sort): ExchangeEventSort {
  const sortDirection =
    sort.direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending;

  let sortProperty: ExchangeEventSortProperty;

  switch (sort.active) {
    case 'id':
      sortProperty = ExchangeEventSortProperty.DocumentId;
      break;
    case 'calculationType':
      sortProperty = ExchangeEventSortProperty.CalculationType;
      break;
    case 'messageType':
      sortProperty = ExchangeEventSortProperty.TimeSeriesType;
      break;
    case 'gridArea':
      sortProperty = ExchangeEventSortProperty.GridAreaCode;
      break;
    case 'lastDispatched':
      sortProperty = ExchangeEventSortProperty.LatestDispatched;
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
}
