import { inject } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { graphql } from '@energinet-datahub/dh/shared/domain';

export function getPermissionsWatchQuery() {
  const apollo = inject(Apollo);

  return apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetPermissionsDocument,
  });
}
