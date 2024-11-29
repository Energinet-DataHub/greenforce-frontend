import { ManuallyHandleOutgoingMessageMutation } from '@energinet-datahub/dh/shared/domain/graphql';

export const resolveMessageMutationMock: ManuallyHandleOutgoingMessageMutation = {
  __typename: 'Mutation',
  manuallyHandleOutgoingMessage: {
    __typename: 'ManuallyHandleOutgoingMessagePayload',
    success: true,
  },
};
