import { EicFunction, UserRoleStatus } from '@energinet-datahub/dh/shared/domain/graphql';

export type UserRolesFilter = {
  status: UserRoleStatus | null;
  marketRoles: EicFunction[] | null;
};
