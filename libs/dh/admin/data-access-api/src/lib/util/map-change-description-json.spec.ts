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

import { mapChangeDescriptionJson } from './map-change-description-json';

describe(mapChangeDescriptionJson.prototype.name, () => {
  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.Created}`, () => {
    const changeDescriptionJson = {
      Name: 'New name',
      Description: 'New description',
      EicFunction: EicFunction.BalanceResponsibleParty,
      Status: UserRoleStatus.Inactive,
      Permissions: [3, 4],
    };

    const actual = mapChangeDescriptionJson(UserRoleChangeType.Created, changeDescriptionJson);

    expect(actual).toBe('');
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.NameChange}`, () => {
    const changeDescriptionJson = { Name: 'New name' };

    const actual = mapChangeDescriptionJson(UserRoleChangeType.NameChange, changeDescriptionJson);

    expect(actual).toBe(changeDescriptionJson.Name);
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.DescriptionChange}`, () => {
    const changeDescriptionJson = { Description: 'New description' };

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.DescriptionChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.Description);
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.EicFunctionChange}`, () => {
    const changeDescriptionJson = {
      EicFunction: EicFunction.BalanceResponsibleParty,
    };

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.EicFunctionChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.EicFunction);
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.StatusChange}`, () => {
    const changeDescriptionJson = { Status: UserRoleStatus.Inactive };

    const actual = mapChangeDescriptionJson(UserRoleChangeType.StatusChange, changeDescriptionJson);

    expect(actual).toBe(changeDescriptionJson.Status);
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.PermissionsChange}`, () => {
    const changeDescriptionJson = { Permissions: [3, 4] };

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.PermissionsChange,
      changeDescriptionJson
    );

    expect(actual).toBe('3, 4');
  });

  it(`throws when "UserRoleChangeType" is unknown`, () => {
    expect(() =>
      mapChangeDescriptionJson('UnknownUserRoleChangeType' as UserRoleChangeType, {})
    ).toThrowError();
  });
});
