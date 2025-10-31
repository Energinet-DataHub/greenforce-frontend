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
import {
  ChargeInformationDto,
  ChargeResolution,
  ChargeSeries,
  ChargeStatus,
  ChargeType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export const charges: ChargeInformationDto[] = [
  {
    __typename: 'ChargeInformationDto',
    id: '1',
    hasAnyPrices: false,
    owner: 'Energy Supplier A',
    chargeType: ChargeType.Fee,
    code: 'CHARGE001',
    name: 'Grid Fee',
    description: 'Monthly grid fee for residential customers',
    validFrom: new Date('2023-01-01T00:00:00Z'),
    validTo: new Date('2023-12-31T23:59:59Z'),
    status: ChargeStatus.Awaiting,
    resolution: ChargeResolution.Daily,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '2',
    hasAnyPrices: true,
    owner: 'Energy Supplier B',
    chargeType: ChargeType.Tariff,
    code: 'CHARGE002',
    name: 'Peak Hours Tariff',
    description: 'Higher rates during peak consumption hours',
    validFrom: new Date('2023-03-01T00:00:00Z'),
    validTo: new Date('2024-02-29T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Hourly,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '3',
    hasAnyPrices: true,
    owner: 'Energy Supplier C',
    chargeType: ChargeType.Subscription,
    code: 'CHARGE003',
    name: 'Green Energy Plan',
    description: 'Subscription for renewable energy sources',
    validFrom: new Date('2023-06-01T00:00:00Z'),
    validTo: new Date('2024-05-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Monthly,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '4',
    hasAnyPrices: false,
    owner: 'Energy Supplier A',
    chargeType: ChargeType.Fee,
    code: 'CHARGE004',
    name: 'Connection Fee',
    description: 'One-time connection fee for new customers',
    validFrom: new Date('2023-07-15T00:00:00Z'),
    validTo: new Date('2025-12-31T23:59:59Z'),
    status: ChargeStatus.Closed,
    resolution: ChargeResolution.Daily,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '5',
    hasAnyPrices: true,
    owner: 'Energy Supplier D',
    chargeType: ChargeType.Tariff,
    code: 'CHARGE005',
    name: 'Night Rate',
    description: 'Discounted rates for nighttime consumption',
    validFrom: new Date('2023-09-01T00:00:00Z'),
    validTo: new Date('2024-08-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Hourly,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '6',
    hasAnyPrices: true,
    owner: 'Energy Supplier B',
    chargeType: ChargeType.Subscription,
    code: 'CHARGE006',
    name: 'Premium Service',
    description: 'Enhanced customer support and priority maintenance',
    validFrom: new Date('2023-10-01T00:00:00Z'),
    validTo: new Date('2024-09-30T23:59:59Z'),
    status: ChargeStatus.Awaiting,
    resolution: ChargeResolution.Monthly,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '7',
    hasAnyPrices: false,
    owner: 'Energy Supplier C',
    chargeType: ChargeType.Fee,
    code: 'CHARGE007',
    name: 'Late Payment Fee',
    description: 'Fee applied for late payment of bills',
    validFrom: new Date('2023-11-01T00:00:00Z'),
    validTo: new Date('2025-12-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Daily,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '8',
    hasAnyPrices: true,
    owner: 'Energy Supplier E',
    chargeType: ChargeType.Tariff,
    code: 'CHARGE008',
    name: 'Industrial Rate',
    description: 'Special tariff for industrial customers',
    validFrom: new Date('2024-01-01T00:00:00Z'),
    validTo: new Date('2024-12-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Hourly,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '9',
    hasAnyPrices: true,
    owner: 'Energy Supplier D',
    chargeType: ChargeType.Subscription,
    code: 'CHARGE009',
    name: 'Smart Meter Plan',
    description: 'Subscription including smart meter maintenance',
    validFrom: new Date('2024-02-01T00:00:00Z'),
    validTo: new Date('2025-01-31T23:59:59Z'),
    status: ChargeStatus.Awaiting,
    resolution: ChargeResolution.Monthly,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '10',
    hasAnyPrices: false,
    owner: 'Energy Supplier A',
    chargeType: ChargeType.Fee,
    code: 'CHARGE010',
    name: 'Document Processing Fee',
    description: 'Administrative fee for document processing',
    validFrom: new Date('2024-03-01T00:00:00Z'),
    validTo: new Date('2025-12-31T23:59:59Z'),
    status: ChargeStatus.Closed,
    resolution: ChargeResolution.Daily,
  },
  {
    __typename: 'ChargeInformationDto',
    id: '11',
    hasAnyPrices: true,
    owner: 'Energy Supplier E',
    chargeType: ChargeType.Tariff,
    code: 'CHARGE011',
    name: 'Holiday Rate',
    description: 'Special tariff rates during public holidays',
    validFrom: new Date('2024-04-01T00:00:00Z'),
    validTo: new Date('2025-03-31T23:59:59Z'),
    status: ChargeStatus.Current,
    resolution: ChargeResolution.Hourly,
  },
];

export const chargeSeriesDayResolution: ChargeSeries[] = Array.from({ length: 30 }, (_, i) => {
  const numPoints = Math.floor(Math.random() * 5) + 1; // 1 to 5 points
  const points = Array.from({ length: numPoints }, (_, j) => ({
    __typename: 'Point' as const,
    fromDateTime: new Date(new Date('2025-10-31T00:00:00Z').setDate(31 - j)),
    toDateTime: new Date(new Date('2025-10-31T23:59:59Z').setDate(31 - j)),
    price: Number((Math.random() * 2).toFixed(2)), // Random price between 0 and 2
  }));
  return {
    __typename: 'ChargeSeries' as const,
    points,
    totalAmount: Number(points.reduce((sum, point) => sum + point.price, 0).toFixed(2)),
  };
});

export const chargeSeriesHourlyResolution: ChargeSeries[] = Array.from({ length: 30 }, (_, i) => {
  const numPoints = 24; // 24 points for hourly resolution
  const points = Array.from({ length: numPoints }, (_, j) => ({
    __typename: 'Point' as const,
    fromDateTime: new Date(new Date('2025-10-31T00:00:00Z').setHours(j)),
    toDateTime: new Date(new Date('2025-10-31T00:59:59Z').setHours(j)),
    price: Number((Math.random() * 2).toFixed(2)), // Random price between 0 and 2
  }));
  return {
    __typename: 'ChargeSeries' as const,
    points,
    totalAmount: Number(points.reduce((sum, point) => sum + point.price, 0).toFixed(2)),
  };
});

export const chargeSeriesMonthlyResolution: ChargeSeries[] = Array.from({ length: 12 }, (_, i) => {
  const numPoints = 1; // 1 point for monthly resolution
  const points = Array.from({ length: numPoints }, () => ({
    __typename: 'Point' as const,
    fromDateTime: new Date(new Date('2025-12-01T00:00:00Z').setMonth(i)),
    toDateTime: new Date(new Date('2025-12-31T23:59:59Z').setMonth(i)),
    price: Number((Math.random() * 50).toFixed(2)), // Random price between 0 and 50
  }));
  return {
    __typename: 'ChargeSeries' as const,
    points,
    totalAmount: Number(points.reduce((sum, point) => sum + point.price, 0).toFixed(2)),
  };
});
