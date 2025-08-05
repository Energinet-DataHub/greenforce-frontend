import { GetMarketParticipantsForRequestCalculationDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type ActorForRequestCalculation = ResultOf<
  typeof GetMarketParticipantsForRequestCalculationDocument
>['marketParticipantsForEicFunction'][0];

export type GridArea = ResultOf<typeof GetGridAreasDocument>['gridAreas'][0];
