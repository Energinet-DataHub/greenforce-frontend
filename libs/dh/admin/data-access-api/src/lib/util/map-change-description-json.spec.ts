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
  MarketParticipantEicFunction,
  MarketParticipantUserRoleChangeType,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';

import { mapChangeDescriptionJson } from './map-change-description-json';

describe(mapChangeDescriptionJson.prototype.name, () => {
  it(`returns value when "MarketParticipantUserRoleChangeType" is ${MarketParticipantUserRoleChangeType.Created}`, () => {
    const changeDescriptionJson = {
      Name: 'New name',
      Description: 'New description',
      MarketParticipantEicFunction: MarketParticipantEicFunction.BalanceResponsibleParty,
      Status: MarketParticipantUserRoleStatus.Inactive,
      Permissions: [3, 4],
    };

    const actual = mapChangeDescriptionJson(
      MarketParticipantUserRoleChangeType.Created,
      changeDescriptionJson
    );

    expect(actual).toBe('');
  });

  it(`returns value when "MarketParticipantUserRoleChangeType" is ${MarketParticipantUserRoleChangeType.NameChange}`, () => {
    const changeDescriptionJson = { Name: 'New name' };

    const actual = mapChangeDescriptionJson(
      MarketParticipantUserRoleChangeType.NameChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.Name);
  });

  it(`returns value when "MarketParticipantUserRoleChangeType" is ${MarketParticipantUserRoleChangeType.DescriptionChange}`, () => {
    const changeDescriptionJson = { Description: 'New description' };

    const actual = mapChangeDescriptionJson(
      MarketParticipantUserRoleChangeType.DescriptionChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.Description);
  });

  it(`returns value when "MarketParticipantUserRoleChangeType" is ${MarketParticipantUserRoleChangeType.EicFunctionChange}`, () => {
    const changeDescriptionJson = {
      MarketParticipantEicFunction: MarketParticipantEicFunction.BalanceResponsibleParty,
    };

    const actual = mapChangeDescriptionJson(
      MarketParticipantUserRoleChangeType.EicFunctionChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.MarketParticipantEicFunction);
  });

  it(`returns value when "MarketParticipantUserRoleChangeType" is ${MarketParticipantUserRoleChangeType.StatusChange}`, () => {
    const changeDescriptionJson = { Status: MarketParticipantUserRoleStatus.Inactive };

    const actual = mapChangeDescriptionJson(
      MarketParticipantUserRoleChangeType.StatusChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.Status);
  });

  it(`returns value when "MarketParticipantUserRoleChangeType" is ${MarketParticipantUserRoleChangeType.PermissionsChange}`, () => {
    const changeDescriptionJson = { Permissions: [3, 4] };

    const actual = mapChangeDescriptionJson(
      MarketParticipantUserRoleChangeType.PermissionsChange,
      changeDescriptionJson
    );

    expect(actual).toBe('3, 4');
  });

  it(`throws when "MarketParticipantUserRoleChangeType" is unknown`, () => {
    expect(() =>
      mapChangeDescriptionJson(
        'UnknownUserRoleChangeType' as MarketParticipantUserRoleChangeType,
        {}
      )
    ).toThrowError();
  });
});
