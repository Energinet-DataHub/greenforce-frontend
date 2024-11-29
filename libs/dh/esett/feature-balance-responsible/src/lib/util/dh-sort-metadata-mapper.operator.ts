import { Sort } from '@angular/material/sort';
import { Observable, map, pipe } from 'rxjs';

import {
  BalanceResponsibleSortProperty,
  SortDirection,
} from '@energinet-datahub/dh/shared/domain/graphql';

type InType = Observable<Sort>;

type OutType = Observable<{
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
}>;

export const dhSortMetadataMapper = pipe<InType, OutType>(
  map(({ active, direction }) => {
    const sortDirection = direction === 'asc' ? SortDirection.Ascending : SortDirection.Descending;

    let sortProperty: BalanceResponsibleSortProperty;

    switch (active) {
      case 'validFrom':
        sortProperty = BalanceResponsibleSortProperty.ValidFrom;
        break;
      case 'validTo':
        sortProperty = BalanceResponsibleSortProperty.ValidTo;
        break;
      case 'received':
      default:
        sortProperty = BalanceResponsibleSortProperty.ReceivedDate;
        break;
    }

    return { sortProperty, sortDirection };
  })
);
