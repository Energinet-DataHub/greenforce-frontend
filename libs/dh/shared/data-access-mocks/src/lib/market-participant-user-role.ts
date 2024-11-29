import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { mockGetPermissionByEicFunctionQuery } from '@energinet-datahub/dh/shared/domain/graphql';

import { marketParticipantUserRolePermissionsQuery } from './data/market-participant-user-role-permissions';

export function marketParticipantUserRoleMocks() {
  return [getPermissionsByEicFunction()];
}

function getPermissionsByEicFunction() {
  return mockGetPermissionByEicFunctionQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({ data: marketParticipantUserRolePermissionsQuery });
  });
}
