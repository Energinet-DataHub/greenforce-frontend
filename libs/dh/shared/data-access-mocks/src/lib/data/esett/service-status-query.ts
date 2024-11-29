import {
  ESettStageComponent,
  GetServiceStatusQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const serviceStatusQueryMock: GetServiceStatusQuery = {
  __typename: 'Query',
  esettServiceStatus: [
    {
      __typename: 'ReadinessStatusDto',
      isReady: true,
      component: ESettStageComponent.Converter,
    },
    {
      __typename: 'ReadinessStatusDto',
      isReady: true,
      component: ESettStageComponent.Ingestion,
    },
    {
      __typename: 'ReadinessStatusDto',
      isReady: false,
      component: ESettStageComponent.Receiver,
    },
    {
      __typename: 'ReadinessStatusDto',
      isReady: false,
      component: ESettStageComponent.Sender,
    },
  ],
};
