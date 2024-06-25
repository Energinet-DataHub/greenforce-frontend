import { UserOverviewItemDto, UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';

export const overviewUsers = [
  {
    __typename: 'UserOverviewItemDto',
    id: '1',
    email: 'test@test.dk',
    firstName: 'Test',
    lastName: 'Test',
    status: UserStatus.Active,
    phoneNumber: '+45 12345678',
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '2',
    email: 'test1@test1.dk',
    firstName: 'Test1',
    lastName: 'Test1',
    status: UserStatus.Inactive,
    phoneNumber: '+45 22345678',
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '3',
    email: 'test1@test2.dk',
    firstName: 'Test2',
    lastName: 'Test2',
    status: UserStatus.InviteExpired,
    phoneNumber: '+45 32345678',
  },
  {
    __typename: 'UserOverviewItemDto',
    id: '4',
    email: 'test1@test3.dk',
    firstName: 'Test3',
    lastName: 'Test3',
    status: UserStatus.Invited,
    phoneNumber: '+45 34345678',
  },
] as UserOverviewItemDto[];
