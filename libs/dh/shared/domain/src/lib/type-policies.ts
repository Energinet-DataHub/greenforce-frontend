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
import { FieldPolicy } from '@apollo/client/cache';
import { Range } from './range';
import { dayjs } from '@energinet-datahub/watt/utils/date';

/** Parses a date from an unknown type. */
function parseDate(date: unknown): Date | null | undefined {
  if (date === null || date === undefined) return date;
  if (date instanceof Date) return date;
  if (typeof date === 'number') return dayjs(date).toDate();
  if (typeof date !== 'string') return new Date(NaN);
  return dayjs(date).toDate();
}

// Custom type policy for serializing GraphQL dates to JS Date.
// This type policy is imported in codegen.ts and used by the
// @homebound/graphql-typescript-scalar-type-policies plugin.
export const dateTypePolicy: FieldPolicy<Date | null | undefined, unknown> = {
  merge: (_, incoming) => parseDate(incoming),
};

// Custom type policy for serializing GraphQL DateRange to JS.
// This type policy is imported in codegen.ts and used by the
// @homebound/graphql-typescript-scalar-type-policies plugin.
export const dateRangeTypePolicy: FieldPolicy<Range<Date | null | undefined>, Range<unknown>> = {
  merge: (_, incoming) => {
    if (!incoming) return incoming;
    return { start: parseDate(incoming.start), end: parseDate(incoming.end) };
  },
};
