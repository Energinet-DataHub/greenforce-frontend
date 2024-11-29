import { FieldPolicy } from '@apollo/client/cache';
import { Range } from './range';
import { dayjs } from '@energinet-datahub/watt/date';

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
