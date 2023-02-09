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
      const permissions: number[] = parsedChangeDescriptionJson.Permissions;

      return permissions.join(', ');
    }
    default:
      throw new Error(`Unknown 'userRoleChangeType': ${userRoleChangeType}`);
  }
}
