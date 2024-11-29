import { ResendExchangeMessagesMutation } from '@energinet-datahub/dh/shared/domain/graphql';

export const resendMessageMutationMock: ResendExchangeMessagesMutation = {
  __typename: 'Mutation',
  resendWaitingEsettExchangeMessages: {
    __typename: 'ResendWaitingEsettExchangeMessagesPayload',
    success: true,
  },
};
