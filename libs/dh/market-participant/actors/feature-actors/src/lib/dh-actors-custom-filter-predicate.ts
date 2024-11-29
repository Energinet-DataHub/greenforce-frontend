import { AllFiltersCombined } from './actors-filters';
import { DhActor } from '@energinet-datahub/dh/market-participant/actors/domain';
import { dhParseJSON } from './dh-json-util';

/**
 * Custom filter predicate function that runs for each actor in the table.
 *
 * @returns `true` if an actor should be shown in the table, `false` otherwise.
 */
// Intentionally disable complexity rule for this function
// eslint-disable-next-line sonarjs/cognitive-complexity
export const dhActorsCustomFilterPredicate = (actor: DhActor, filtersJSON: string): boolean => {
  const filters: AllFiltersCombined = dhParseJSON(filtersJSON);

  // If all filters are at their initial state (`null` or "" (empty string)), show actor
  if (Object.values(filters).every((filter) => filter === null || filter === '')) {
    return true;
  }

  // If a filter is set, but some of the actor's properties are `null`/`undefined`, do not show actor
  if (actor.status == null || actor.marketRole == null) {
    return false;
  }

  if (filters.actorStatus && !filters.actorStatus.includes(actor.status)) {
    return false;
  }

  if (filters.marketRoles && !filters.marketRoles.includes(actor.marketRole)) {
    return false;
  }

  if (filters.searchInput) {
    return (
      actor.glnOrEicNumber.includes(filters.searchInput) ||
      actor.name.toLocaleLowerCase().includes(filters.searchInput.toLocaleLowerCase())
    );
  }

  return true;
};
