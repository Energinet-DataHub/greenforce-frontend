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
  mockGetChargesQuery,
  mockGetChargeByIdQuery,
  mockGetChargeSeriesQuery,
  mockGetChargeLinksByMeteringPointIdQuery,
  mockGetChargeLinkHistoryQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import {
  Charge,
  ChargeLink,
  ChargeResolution,
  ChargeSeries,
  ChargeStatus,
  ChargeType,
  MarketParticipant,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { dayjs, WattRange } from '@energinet/watt/core/date';

const chargeLinks: ChargeLink[] = [
  {
    __typename: 'ChargeLink',
    id: '1000',
    type: ChargeType.Fee,
    amount: 100.0,
    name: 'Charge Link 1',
    displayName: '1000 • Charge Link 1',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-1',
      displayName: '1234567890123 • Energy Supplier A',
    } as MarketParticipant,
    history: [
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-01-15T10:00:00Z'),
        description: 'Initial link creation',
        messageId: 'msg-001',
      },
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-06-20T14:30:00Z'),
        description: 'Updated charge amount',
        messageId: 'msg-002',
      },
    ],
    period: { start: new Date('2023-01-01T00:00:00Z'), end: new Date('2023-12-31T23:59:59Z') },
  },
];

const makeChargesMock = (interval?: WattRange<Date>): Charge[] => [
  {
    __typename: 'Charge',
    id: '1',
    displayName: 'CHARGE001 • Grid Fee',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-1',
      name: 'Energy Supplier A',
      glnOrEicNumber: '1234567890123',
      displayName: '1234567890123 • Energy Supplier A',
    } as MarketParticipant,
    type: ChargeType.Fee,
    code: 'CHARGE001',
    name: 'Grid Fee (QuarterHourly)',
    description: 'Monthly grid fee for residential customers',
    validFrom: new Date('2023-01-01T00:00:00Z'),
    validTo: new Date('2023-12-31T23:59:59Z'),
    status: ChargeStatus.Awaiting,
    resolution: ChargeResolution.Quarterhourly,
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Quarterhourly) : [],
  },
  {
    __typename: 'Charge',
    id: '2',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-2',
      name: 'Energy Supplier B',
      glnOrEicNumber: '2345678901234',
      displayName: '2345678901234 • Energy Supplier B',
    } as MarketParticipant,
    type: ChargeType.Tariff,
    code: 'CHARGE002',
    displayName: 'CHARGE002 • Peak Hours Tariff',
    name: 'Peak Hours Tariff (Hourly)',
    description: 'Higher rates during peak consumption hours',
    validFrom: new Date('2023-03-01T00:00:00Z'),
    validTo: new Date('2024-02-29T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Hourly,
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Hourly) : [],
  },
  {
    __typename: 'Charge',
    id: '3',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-3',
      name: 'Energy Supplier C',
      glnOrEicNumber: '3456789012345',
      displayName: '3456789012345 • Energy Supplier C',
    } as MarketParticipant,
    type: ChargeType.Subscription,
    code: 'CHARGE003',
    displayName: 'CHARGE003 • Green Energy Plan',
    name: 'Green Energy Plan (Daily)',
    description: 'Subscription for renewable energy sources',
    validFrom: new Date('2023-06-01T00:00:00Z'),
    validTo: new Date('2024-05-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Daily,
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Daily) : [],
  },
  {
    __typename: 'Charge',
    id: '4',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-4',
      name: 'Energy Supplier D',
      glnOrEicNumber: '4567890123456',
      displayName: '4567890123456 • Energy Supplier D',
    } as MarketParticipant,
    type: ChargeType.Fee,
    code: 'CHARGE004',
    displayName: 'CHARGE004 • Connection Fee',
    name: 'Connection Fee (Monthly)',
    description: 'One-time connection fee for new customers',
    validFrom: new Date('2023-07-15T00:00:00Z'),
    validTo: new Date('2025-12-31T23:59:59Z'),
    status: ChargeStatus.Closed,
    resolution: ChargeResolution.Monthly,
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Monthly) : [],
  },
  {
    __typename: 'Charge',
    id: '5',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-11',
      name: 'Energy Supplier E',
      glnOrEicNumber: '1234567890133',
      displayName: '1234567890133 • Energy Supplier E',
    } as MarketParticipant,
    type: ChargeType.Tariff,
    code: 'CHARGE005',
    displayName: 'CHARGE005 • Holiday Rate',
    name: 'Holiday Rate (Unknown)',
    description: 'Special tariff rates during public holidays',
    validFrom: new Date('2024-04-01T00:00:00Z'),
    validTo: new Date('2025-03-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Unknown,
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Unknown) : [],
  },
];

const makeChargeSeriesListMock = (
  interval: WattRange<Date>,
  resolution: ChargeResolution
): ChargeSeries[] => {
  const start = dayjs(interval.start);
  const end = dayjs(interval.end).add(1, 'ms');
  switch (resolution) {
    case ChargeResolution.Quarterhourly:
      return Array.from({ length: end.diff(interval.start, 'm') / 15 })
        .map((_, i) => ({ start: start.add(i * 15, 'm'), end: start.add((i + 1) * 15, 'm') }))
        .map(makeChargeSeriesMock);
    case ChargeResolution.Hourly:
      return Array.from({ length: end.diff(interval.start, 'h') })
        .map((_, i) => ({ start: start.add(i, 'h'), end: start.add(i + 1, 'h') }))
        .map(makeChargeSeriesMock);
    case ChargeResolution.Unknown:
    case ChargeResolution.Daily:
      return Array.from({ length: end.diff(interval.start, 'd') })
        .map((_, i) => ({ start: start.add(i, 'd'), end: start.add(i + 1, 'd') }))
        .map(makeChargeSeriesMock);
    case ChargeResolution.Monthly:
      return Array.from({ length: end.diff(interval.start, 'M') })
        .map((_, i) => ({ start: start.add(i, 'M'), end: start.add(i + 1, 'M') }))
        .map(makeChargeSeriesMock);
  }
};

const makeChargeSeriesMock = (period: { start: dayjs.Dayjs; end: dayjs.Dayjs }): ChargeSeries => {
  const points = makeChargeSeriesPointsMock(period.end);
  return {
    __typename: 'ChargeSeries' as const,
    price: points[0].price,
    period: { start: period.start.toDate(), end: period.end.subtract(1, 'ms').toDate() },
    hasChanged: points.length > 1,
    points,
  };
};

const makeChargeSeriesPointsMock = (end: dayjs.Dayjs) => {
  const randomInt = ({ max = 5, min = 0 }) => Math.round(Math.random() * (max - min)) + min;
  return Array.from({ length: randomInt({ min: 1 }) })
    .map((_, index) => index)
    .map((i) => ({
      __typename: 'ChargeSeriesPoint' as const,
      fromDateTime: new Date(end.year() - i - 1, randomInt({ max: 11 })),
      toDateTime: i === 0 ? new Date(9999, 0) : new Date(end.year() - i, randomInt({ max: 11 })),
      isCurrent: i === 0,
      price: randomInt({ max: 50 * 100 }) / 100,
    }));
};

function getCharges() {
  return mockGetChargesQuery(async () => {
    await delay(mswConfig.delay);
    const charges = makeChargesMock();
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        charges: {
          __typename: 'ChargesCollectionSegment',
          pageInfo: {
            __typename: 'CollectionSegmentInfo',
            hasNextPage: false,
            hasPreviousPage: false,
          },
          totalCount: charges.length,
          items: charges,
        },
      },
    });
  });
}

function getChargeById() {
  return mockGetChargeByIdQuery(async ({ variables: { id } }) => {
    await delay(mswConfig.delay);
    const charges = makeChargesMock();
    const charge = charges.find((charge) => charge.id === id) || null;
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        chargeById: charge,
      },
    });
  });
}

function getChargeSeries() {
  return mockGetChargeSeriesQuery(async ({ variables: { chargeId, interval } }) => {
    await delay(mswConfig.delay);
    const charges = makeChargesMock(interval);
    const chargeInformation = charges.find((c) => c.id === chargeId);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        chargeById: chargeInformation,
      },
    });
  });
}

function getChargesByMeteringPointId() {
  return mockGetChargeLinksByMeteringPointIdQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        chargeLinksByMeteringPointId: chargeLinks,
      },
    });
  });
}

function getChargeLinkById() {
  return mockGetChargeLinkHistoryQuery(async ({ variables: { chargeLinkId } }) => {
    await delay(mswConfig.delay);
    const chargeLink = chargeLinks.find((cl) => cl.id === chargeLinkId) || null;
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        chargeLinkById: chargeLink,
      },
    });
  });
}

export function chargesMocks() {
  return [
    getCharges(),
    getChargeById(),
    getChargeSeries(),
    getChargesByMeteringPointId(),
    getChargeLinkById(),
  ];
}
