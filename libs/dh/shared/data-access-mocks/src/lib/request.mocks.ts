//#region License
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
//#endregion
import { delay, HttpResponse } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import {
  WholesaleAndEnergyCalculationType,
  MeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  mockGetRequestsQuery,
  mockGetRequestOptionsQuery,
  mockRequestMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

export function requestMocks() {
  return [getRequestsQuery(), getRequestOptionsQuery(), requestMutation()];
}

function getRequestsQuery() {
  return mockGetRequestsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        requests: {
          __typename: 'RequestsConnection',
          totalCount: 0,
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: null,
            endCursor: null,
          },
          nodes: null,
        },
      },
    });
  });
}

function getRequestOptionsQuery() {
  return mockGetRequestOptionsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        requestOptions: {
          __typename: 'RequestOptions',
          calculationTypes: [
            {
              __typename: 'OptionOfCalculationType',
              value: WholesaleAndEnergyCalculationType.Aggregation,
              displayValue: 'Aggregation',
            },
            {
              __typename: 'OptionOfCalculationType',
              value: WholesaleAndEnergyCalculationType.BalanceFixing,
              displayValue: 'BalanceFixing',
            },
            {
              __typename: 'OptionOfCalculationType',
              value: WholesaleAndEnergyCalculationType.WholesaleFixing,
              displayValue: 'WholesaleFixing',
            },
            {
              __typename: 'OptionOfCalculationType',
              value: WholesaleAndEnergyCalculationType.FirstCorrectionSettlement,
              displayValue: 'FirstCorrectionSettlement',
            },
            {
              __typename: 'OptionOfCalculationType',
              value: WholesaleAndEnergyCalculationType.SecondCorrectionSettlement,
              displayValue: 'SecondCorrectionSettlement',
            },
            {
              __typename: 'OptionOfCalculationType',
              value: WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement,
              displayValue: 'ThirdCorrectionSettlement',
            },
          ],
          meteringPointTypes: [
            {
              __typename: 'OptionOfMeteringPointType',
              value: MeteringPointType.Production,
              displayValue: 'Production',
            },
            {
              __typename: 'OptionOfMeteringPointType',
              value: MeteringPointType.Exchange,
              displayValue: 'Exchange',
            },
            {
              __typename: 'OptionOfMeteringPointType',
              value: MeteringPointType.FlexConsumption,
              displayValue: 'FlexConsumption',
            },
            {
              __typename: 'OptionOfMeteringPointType',
              value: MeteringPointType.NonProfiledConsumption,
              displayValue: 'NonProfiledConsumption',
            },
            {
              __typename: 'OptionOfMeteringPointType',
              value: MeteringPointType.TotalConsumption,
              displayValue: 'TotalConsumption',
            },
          ],
          isGridAreaRequired: false,
        },
        gridAreas: [
          {
            __typename: 'GridAreaDto',
            id: 'DK1',
            value: 'DK1',
            displayValue: 'DK2',
          },
          {
            __typename: 'GridAreaDto',
            id: 'DK1',
            value: 'DK1',
            displayValue: 'DK2',
          },
        ],
      },
    });
  });
}

function requestMutation() {
  return mockRequestMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        request: {
          __typename: 'RequestPayload',
          success: true,
        },
      },
    });
  });
}
