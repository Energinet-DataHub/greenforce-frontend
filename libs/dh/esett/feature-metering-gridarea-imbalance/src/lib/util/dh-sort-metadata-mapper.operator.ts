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
