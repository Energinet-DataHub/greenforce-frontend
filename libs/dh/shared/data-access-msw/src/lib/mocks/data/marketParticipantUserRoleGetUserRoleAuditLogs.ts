import {
  MarketParticipantUserRoleAuditLogDto,
  MarketParticipantUserRoleAuditLogsDto,
} from '@energinet-datahub/dh/shared/domain';

type BaseLog = Pick<
  MarketParticipantUserRoleAuditLogDto,
  'userRoleId' | 'changedByUserId' | 'changedByUserName'
>;

const baseLog: BaseLog = {
  userRoleId: '3f4c5be3-1e12-4ed4-9d34-05fee4763127',
  changedByUserId: '25499d8c-8d8a-45e1-93a3-74011c07b1b3',
  changedByUserName: 'Test User',
};

export const marketParticipantUserRoleAuditLogs: MarketParticipantUserRoleAuditLogsDto = {
  auditLogs: [
    {
      ...baseLog,
      timestamp: '2023-01-01T12:47:03.4871748+00:00',
      userRoleChangeType: 'Created',
      changeDescriptionJson:
        '{"Name":"NewRole","Description":"New description","EicFunction":"BalanceResponsibleParty","Status":"Active","Permissions":["UsersManage"]}',
    },
    {
      ...baseLog,
      timestamp: '2023-01-02T12:48:38.0587304+00:00',
      userRoleChangeType: 'NameChange',
      changeDescriptionJson: '{"Name":"Nyt navn"}',
    },
    {
      ...baseLog,
      timestamp: '2023-01-03T12:48:38.0587304+00:00',
      userRoleChangeType: 'DescriptionChange',
      changeDescriptionJson: '{"Description":"Nyt beskrivelse"}',
    },
    {
      ...baseLog,
      timestamp: '2023-01-04T12:48:38.0587304+00:00',
      userRoleChangeType: 'EicFunctionChange',
      changeDescriptionJson: '{"EicFunction":"MarketOperator"}',
    },
    {
      ...baseLog,
      timestamp: '2023-01-05T12:48:38.0587304+00:00',
      userRoleChangeType: 'StatusChange',
      changeDescriptionJson: '{"Status":"Inactive"}',
    },
    {
      ...baseLog,
      timestamp: '2023-01-06T12:48:38.0587304+00:00',
      userRoleChangeType: 'PermissionsChange',
      changeDescriptionJson: '{"Permissions": ["OrganizationView","UsersManage"]}',
    },
  ],
};
