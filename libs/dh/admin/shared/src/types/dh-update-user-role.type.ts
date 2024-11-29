import { UpdateUserRoleAssignmentsDtoInput } from '@energinet-datahub/dh/shared/domain/graphql';

export type UpdateUserRolesWithActorId = {
  id: string;
  atLeastOneRoleIsAssigned: boolean;
  userRolesToUpdate: UpdateUserRoleAssignmentsDtoInput;
};

export type UpdateUserRoles = {
  actors: UpdateUserRolesWithActorId[];
};
