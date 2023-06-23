import { ResultOf } from 'apollo-angular';

import { GetActorsForSettlementReportDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type Actor = ResultOf<typeof GetActorsForSettlementReportDocument>['actors'][0];
