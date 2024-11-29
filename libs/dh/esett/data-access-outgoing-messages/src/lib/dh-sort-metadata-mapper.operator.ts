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
