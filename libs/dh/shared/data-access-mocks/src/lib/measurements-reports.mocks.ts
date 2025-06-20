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
  mockGetMeasurementsReportsQuery,
  mockRequestMeasurementsReportMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import {
  MeasurementsReportMeteringPointType,
  MeasurementsReportStatusType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export function measurementsReportsMocks(apiBase: string) {
  return [getMeasurementsReports(apiBase), requestMeasurementsReportMutation()];
}

function getMeasurementsReports(apiBase: string) {
  return mockGetMeasurementsReportsQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        measurementsReports: [
          {
            __typename: 'MeasurementsReport',
            id: '1',
            createdDateTime: new Date('2023-01-01T00:00:00Z'),
            actor: {
              __typename: 'Actor',
              id: '1',
              name: 'Test Actor',
            },
            meteringPointTypes: null,
            gridAreaCodes: ['404', '405', '406'],
            period: {
              start: new Date('2023-08-01T00:00:00Z'),
              end: new Date('2023-08-31T23:59:59Z'),
            },
            statusType: MeasurementsReportStatusType.Completed,
            measurementsReportDownloadUrl: `${apiBase}/v1/WholesaleMeasurementsReport/DownloadReport`,
          },
          {
            __typename: 'MeasurementsReport',
            id: '2',
            createdDateTime: new Date('2024-05-01T00:00:00Z'),
            actor: {
              __typename: 'Actor',
              id: '1',
              name: 'Test Actor',
            },
            meteringPointTypes: [
              MeasurementsReportMeteringPointType.Consumption,
              MeasurementsReportMeteringPointType.Production,
              MeasurementsReportMeteringPointType.Exchange,
            ],
            gridAreaCodes: ['404'],
            period: {
              start: new Date('2024-01-01T00:00:00Z'),
              end: new Date('2024-01-31T23:59:59Z'),
            },
            statusType: MeasurementsReportStatusType.InProgress,
            measurementsReportDownloadUrl: `${apiBase}/v1/WholesaleMeasurementsReport/DownloadReport`,
          },
        ],
      },
    });
  });
}

function requestMeasurementsReportMutation() {
  return mockRequestMeasurementsReportMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        requestMeasurementsReport: {
          __typename: 'RequestMeasurementsReportPayload',
          boolean: true,
        },
      },
    });
  });
}
