import {
  EicFunction,
  UserRoleChangeType,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';

import { mapChangeDescriptionJson } from './map-change-description-json';

describe('mapChangeDescriptionJson.prototype.name', () => {
  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.Created}`, () => {
    const changeDescriptionJson = {
      Name: 'New name',
      Description: 'New description',
      EicFunction: EicFunction.BalanceResponsibleParty,
      Status: UserRoleStatus.Inactive,
      Permissions: ['UsersManage', 'UsersView'],
    };

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.Created,
      changeDescriptionJson
    );

    expect(actual).toBe('');
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.NameChange}`, () => {
    const changeDescriptionJson = { Name: 'New name' };

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.NameChange,
      changeDescriptionJson
    );

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

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.StatusChange,
      changeDescriptionJson
    );

    expect(actual).toBe(changeDescriptionJson.Status);
  });

  it(`returns value when "UserRoleChangeType" is ${UserRoleChangeType.PermissionsChange}`, () => {
    const changeDescriptionJson = { Permissions: ['UsersManage', 'UsersView'] };

    const actual = mapChangeDescriptionJson(
      UserRoleChangeType.PermissionsChange,
      changeDescriptionJson
    );

    expect(actual).toBe('UsersManage, UsersView');
  });

  it(`throws when "UserRoleChangeType" is unknown`, () => {
    expect(() =>
      mapChangeDescriptionJson(
        'UnknownUserRoleChangeType' as UserRoleChangeType,
        {}
      )
    ).toThrowError();
  });
});
