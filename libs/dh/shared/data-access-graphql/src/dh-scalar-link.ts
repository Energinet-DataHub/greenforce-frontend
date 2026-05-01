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
import { ApolloLink } from '@apollo/client/core';
import { dayjs } from '@energinet/watt/date';
import { scalarFieldMap } from '@energinet-datahub/dh/shared/domain/graphql/scalar-field-map';
import { assertIsRecord } from '@energinet-datahub/dh/shared/util-assert';

/** Parses a date from an unknown value. */
function parseDate(date: unknown): Date | null | undefined {
  if (date === null || date === undefined) return date;
  if (date instanceof Date) return date;
  if (typeof date === 'number') return dayjs(date).toDate();
  if (typeof date !== 'string') return new Date(NaN);
  return dayjs(date).toDate();
}

/** Scalar parsers keyed by GraphQL scalar type name. */
const scalarParsers: Record<string, (value: unknown) => unknown> = {
  Date: parseDate,
  DateTime: parseDate,
  DateRange: (value: unknown) => {
    if (!value || typeof value !== 'object') return value;
    assertIsRecord(value);
    return { start: parseDate(value['start']), end: parseDate(value['end']) };
  },
};

/** Recursively walks a value, delegating objects to `transformObject`. */
function transformValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(transformValue);
  if (typeof value !== 'object') return value;
  assertIsRecord(value);
  return transformObject(value);
}

/** Transforms scalar fields on a GraphQL object using the codegen-produced field map. */
function transformObject(data: Record<string, unknown>) {
  const typename = data['__typename'];
  const scalarFields = typeof typename === 'string' ? scalarFieldMap[typename] : null;
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      const scalarName = scalarFields?.[key];
      const parser = scalarName ? scalarParsers[scalarName] : null;
      if (!parser) return [key, transformValue(value)];
      return [key, Array.isArray(value) ? value.map(parser) : parser(value)];
    })
  );
}

/**
 * Apollo Link that transforms custom scalar fields (Date, DateTime, DateRange)
 * in network responses before they reach the Apollo cache.
 */
export function createScalarLink() {
  return new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      if (response.data) response.data = transformObject(response.data);
      return response;
    })
  );
}
