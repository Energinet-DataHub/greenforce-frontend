/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { ResultOf } from '@graphql-typed-document-node/core';
import {
  GetCalculationsDocument,
  CalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import dayjs from 'dayjs';

export type Calculation = ResultOf<typeof GetCalculationsDocument>['calculations'][0];

export type CalculationGridArea = ResultOf<
  typeof GetCalculationsDocument
>['calculations'][0]['gridAreas'][0];

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
