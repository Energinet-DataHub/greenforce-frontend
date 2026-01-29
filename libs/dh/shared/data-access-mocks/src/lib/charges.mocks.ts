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
  mockGetChargeByTypeQuery,
  mockGetChargeLinkHistoryQuery,
  mockGetChargeLinksByMeteringPointIdQuery,
  mockStopChargeLinkMutation,
  mockCancelChargeLinkMutation,
  mockEditChargeLinkMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import {
  Charge,
  ChargeType,
  ChargeLink,
  ChargeSeriesPoint,
  ChargeStatus,
  ChargeResolution,
  MarketParticipant,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { dayjs, WattRange } from '@energinet/watt/core/date';

const makeChargesMock = (interval?: WattRange<Date>): Charge[] => [
  {
    __typename: 'Charge',
    id: '1',
    name: 'Grid Fee',
    description: 'current period',
    displayName: 'CHARGE001 • Grid Fee',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-1',
      name: 'Energy xupplier A',
      glnOrEicNumber: '1234567890123',
      displayName: '1234567890123 • Energy Supplier A',
    } as MarketParticipant,
    type: ChargeType.Fee,
    code: 'CHARGE001',
    status: ChargeStatus.Awaiting,
    resolution: ChargeResolution.QuarterHourly,
    predictablePrice: false,
    transparentInvoicing: true,
    vatInclusive: false,
    periods: [
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'Initial period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CLOSED',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'current period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CURRENT',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
    ],
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.QuarterHourly) : [],
  },
  {
    __typename: 'Charge',
    id: '2',
    name: 'Peak Hours Tariff',
    description: 'current period',
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
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Hourly,
    predictablePrice: false,
    transparentInvoicing: false,
    vatInclusive: false,
    periods: [
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'Initial period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CLOSED',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'current period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CURRENT',
        transparentInvoicing: false,
        vatInclusive: false,
        predictablePrice: false,
      },
    ],
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Hourly) : [],
  },
  {
    __typename: 'Charge',
    id: '3',
    name: 'Green Energy Plan',
    description: 'current period',
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
    status: ChargeStatus.Cancelled,
    resolution: ChargeResolution.Daily,
    predictablePrice: false,
    transparentInvoicing: true,
    vatInclusive: false,
    periods: [
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'Initial period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CLOSED',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'current period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CURRENT',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
    ],
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Daily) : [],
  },
  {
    __typename: 'Charge',
    id: '4',
    name: 'Connection Fee',
    description: 'current period',
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
    status: ChargeStatus.Cancelled,
    resolution: ChargeResolution.Monthly,
    predictablePrice: false,
    transparentInvoicing: true,
    vatInclusive: false,
    periods: [
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'Initial period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CLOSED',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'current period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CURRENT',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
    ],
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Monthly) : [],
  },
  {
    __typename: 'Charge',
    id: '5',
    name: 'Connection Fee',
    description: 'current period',
    owner: {
      __typename: 'MarketParticipant',
      id: 'owner-5',
      name: 'Energy Supplier D',
      glnOrEicNumber: '4567890123456',
      displayName: '4567890123456 • Energy Supplier D',
    } as MarketParticipant,
    type: ChargeType.TariffTax,
    code: 'CHARGE005',
    displayName: 'CHARGE005 • Connection Fee',
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Monthly,
    predictablePrice: false,
    transparentInvoicing: true,
    vatInclusive: false,
    periods: [
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'Initial period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CLOSED',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
      {
        __typename: 'ChargePeriod',
        name: 'Period 2022',
        description: 'current period',
        period: { start: new Date('2022-01-01T00:00:00Z'), end: new Date('2022-12-31T23:59:59Z') },
        status: 'CURRENT',
        transparentInvoicing: true,
        vatInclusive: false,
        predictablePrice: false,
      },
    ],
    series: interval ? makeChargeSeriesListMock(interval, ChargeResolution.Monthly) : [],
  },
];

const chargeLinks: ChargeLink[] = [
  {
    __typename: 'ChargeLink',
    id: '1000',
    amount: 100.0,
    period: {
      __typename: 'ChargeLinkPeriod',
      amount: 100.0,
      interval: { start: new Date('2023-01-01T00:00:00Z'), end: new Date('2023-12-31T23:59:59Z') },
    },
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
    charge: makeChargesMock()[0],
  },
  {
    __typename: 'ChargeLink',
    id: '1001',
    amount: 75.5,
    period: null,
    history: [
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-02-10T09:00:00Z'),
        description: 'Initial link creation',
        messageId: 'msg-003',
      },
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-03-15T11:00:00Z'),
        description: 'Changed owner',
        messageId: 'msg-004',
      },
    ],
    charge: makeChargesMock()[1],
  },
  {
    __typename: 'ChargeLink',
    id: '1002',
    amount: 50.0,
    period: {
      __typename: 'ChargeLinkPeriod',
      amount: 50.0,
      interval: { start: new Date('2023-03-01T00:00:00Z'), end: new Date('2023-09-30T23:59:59Z') },
    },
    history: [
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-03-05T08:30:00Z'),
        description: 'Initial link creation',
        messageId: 'msg-005',
      },
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-04-10T10:45:00Z'),
        description: 'Changed period',
        messageId: 'msg-006',
      },
    ],
    charge: makeChargesMock()[2],
  },
  {
    __typename: 'ChargeLink',
    id: '1003',
    amount: 120.0,
    period: {
      __typename: 'ChargeLinkPeriod',
      amount: 120.0,
      interval: { start: new Date('2023-04-01T00:00:00Z'), end: new Date('2023-10-31T23:59:59Z') },
    },
    history: [
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-04-12T12:00:00Z'),
        description: 'Initial link creation',
        messageId: 'msg-007',
      },
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-05-20T15:00:00Z'),
        description: 'Changed amount',
        messageId: 'msg-008',
      },
    ],
    charge: makeChargesMock()[3],
  },
  {
    __typename: 'ChargeLink',
    id: '1004',
    amount: 120.0,
    period: {
      __typename: 'ChargeLinkPeriod',
      amount: 120.0,
      interval: { start: new Date('2023-04-01T00:00:00Z'), end: new Date('2023-10-31T23:59:59Z') },
    },
    history: [
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-04-12T12:00:00Z'),
        description: 'Initial link creation',
        messageId: 'msg-007',
      },
      {
        __typename: 'ChargeLinkHistory',
        submittedAt: new Date('2023-05-20T15:00:00Z'),
        description: 'Changed amount',
        messageId: 'msg-008',
      },
    ],
    charge: makeChargesMock()[4],
  },
];

const makeChargeSeriesListMock = (
  interval: WattRange<Date>,
  resolution: ChargeResolution
): ChargeSeriesPoint[] => {
  const start = dayjs(interval.start);
  const end = dayjs(interval.end).add(1, 'ms');
  switch (resolution) {
    case ChargeResolution.QuarterHourly:
      return Array.from({ length: end.diff(interval.start, 'm') / 15 })
        .map((_, i) => ({ start: start.add(i * 15, 'm'), end: start.add((i + 1) * 15, 'm') }))
        .map(makeChargeSeriesMock);
    case ChargeResolution.Hourly:
      return Array.from({ length: end.diff(interval.start, 'h') })
        .map((_, i) => ({ start: start.add(i, 'h'), end: start.add(i + 1, 'h') }))
        .map(makeChargeSeriesMock);
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

const makeChargeSeriesMock = (period: {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
}): ChargeSeriesPoint => {
  const changes = makeChargeSeriesPointChangesMock(period.end);
  return {
    __typename: 'ChargeSeriesPoint' as const,
    price: changes[0].price,
    period: { start: period.start.toDate(), end: period.end.subtract(1, 'ms').toDate() },
    hasChanged: changes.length > 1,
    changes,
  };
};

const makeChargeSeriesPointChangesMock = (end: dayjs.Dayjs) => {
  const randomInt = ({ max = 5, min = 0 }) => Math.round(Math.random() * (max - min)) + min;
  return Array.from({ length: randomInt({ min: 1 }) })
    .map((_, index) => index)
    .map((i) => ({
      __typename: 'ChargeSeriesPointChange' as const,
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
          __typename: 'ChargesConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: null,
            endCursor: null,
          },
          totalCount: charges.length,
          nodes: charges,
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
  return mockGetChargeLinkHistoryQuery(async ({ variables: { id } }) => {
    await delay(mswConfig.delay);
    const chargeLink = chargeLinks.find((cl) => cl.id === id) || null;
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        chargeLinkById: chargeLink,
      },
    });
  });
}

function getChargesByType() {
  return mockGetChargeByTypeQuery(async ({ variables: { type } }) => {
    await delay(mswConfig.delay);
    const charges = makeChargesMock();
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        chargesByType: charges
          .filter((charge) => charge.type === type)
          .map((charge) => ({
            __typename: 'Charge',
            value: charge.id,
            displayValue: charge.displayName,
          })),
      },
    });
  });
}

function stopChargeLink() {
  return mockStopChargeLinkMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        stopChargeLink: {
          __typename: 'StopChargeLinkPayload',
          success: true,
        },
      },
    });
  });
}

function cancelChargeLink() {
  return mockCancelChargeLinkMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        cancelChargeLink: {
          __typename: 'CancelChargeLinkPayload',
          success: true,
        },
      },
    });
  });
}

function editChargeLink() {
  return mockEditChargeLinkMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        editChargeLink: {
          __typename: 'EditChargeLinkPayload',
          success: true,
        },
      },
    });
  });
}

export function chargesMocks() {
  return [
    getCharges(),
    getChargeById(),
    stopChargeLink(),
    editChargeLink(),
    getChargeSeries(),
    cancelChargeLink(),
    getChargesByType(),
    getChargeLinkById(),
    getChargesByMeteringPointId(),
  ];
}
