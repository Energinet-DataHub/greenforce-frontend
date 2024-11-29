import type { ResultOf } from '@graphql-typed-document-node/core';

import { GetSettlementReportsDocument } from './generated/graphql/types';

export type DhSettlementReports = ResultOf<
  typeof GetSettlementReportsDocument
>['settlementReports'];

export type DhSettlementReport = DhSettlementReports[0];
