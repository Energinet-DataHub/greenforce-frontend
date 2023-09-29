import { map, pipe } from 'rxjs';

import {
  BalanceResponsibleSortProperty,
  SortDirection,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const dhSortMetaDataMapper = pipe(
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
