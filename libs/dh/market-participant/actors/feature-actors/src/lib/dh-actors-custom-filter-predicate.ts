import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

import { ActorsFilters } from './actors-filters';
import { DhActor } from './dh-actor';

/**
 * Custom filter predicate function that runs for each actor in the table.
 *
 * @returns `true` if an actor should be shown in the table, `false` otherwise.
 */
export const dhActorsCustomFilterPredicate = () => {
  return (actor: DhActor, filtersJSON: string): boolean => {
    let filters: ActorsFilters;

    try {
      filters = JSON.parse(filtersJSON) as ActorsFilters;
    } catch (error) {
      throw new Error(`Invalid filters: ${filtersJSON}`);
    }

    // If all filters are `null`, show actor
    if (Object.values(filters).every((filter) => filter === null)) {
      return true;
    }

    if (Object.values(filters).every((filter) => filter !== null)) {
      return whenAllFiltersAreSet(filters, actor);
    }

    if (filters.actorStatus !== null && actor.status != null) {
      return filters.actorStatus.includes(actor.status);
    }

    if (filters.marketRoles !== null && actor.marketRole != null) {
      return filters.marketRoles.includes(actor.marketRole);
    }

    // If we reach this point, then the actor should not be shown in the table
    // either because some of its properties are `null`,
    // or a new filter has been added that is missing from this function.
    return false;
  };
};

/**
 * Checks whether selected actor's properties are included in the selected filter values
 */
function whenAllFiltersAreSet(filters: ActorsFilters, actor: DhActor): boolean {
  if (actor.status == null || actor.marketRole == null) {
    return false;
  }

  return (
    (filters.actorStatus as ActorStatus[]).includes(actor.status) &&
    (filters.marketRoles as EicFunction[]).includes(actor.marketRole)
  );
}
