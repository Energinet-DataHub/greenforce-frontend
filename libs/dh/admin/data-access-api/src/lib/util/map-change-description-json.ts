import {
  EicFunction,
  UserRoleChangeType,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';

export function mapChangeDescriptionJson(
  userRoleChangeType: UserRoleChangeType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsedChangeDescriptionJson: any
): string {
  switch (userRoleChangeType) {
    // Note: Data for this type is currently not displayed in the UI
    case 'Created':
      return '';
    case 'NameChange':
      return parsedChangeDescriptionJson.Name as string;
    case 'DescriptionChange':
      return parsedChangeDescriptionJson.Description as string;
    case 'EicFunctionChange':
      return parsedChangeDescriptionJson.EicFunction as EicFunction;
    case 'StatusChange':
      return parsedChangeDescriptionJson.Status as UserRoleStatus;
    case 'PermissionsChange': {
      const permissions: string[] = parsedChangeDescriptionJson.Permissions;

      return permissions.join(', ');
    }
    default:
      throw new Error(`Unknown 'userRoleChangeType': ${userRoleChangeType}`);
  }
}
