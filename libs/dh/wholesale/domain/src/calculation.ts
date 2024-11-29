import type { ResultOf } from '@graphql-typed-document-node/core';
import {
  GetCalculationsDocument,
  CalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import dayjs from 'dayjs';

export type Calculation = NonNullable<
  NonNullable<ResultOf<typeof GetCalculationsDocument>['calculations']>['nodes']
>[number];

export type CalculationGridArea = Calculation['gridAreas'][0];

export const wholesaleCalculationTypes = [
  CalculationType.WholesaleFixing,
  CalculationType.FirstCorrectionSettlement,
  CalculationType.SecondCorrectionSettlement,
  CalculationType.ThirdCorrectionSettlement,
];

export const aggregationCalculationTypes = [
  CalculationType.Aggregation,
  CalculationType.BalanceFixing,
];

export const getMinDate = () => dayjs().startOf('month').subtract(38, 'months').toDate();
