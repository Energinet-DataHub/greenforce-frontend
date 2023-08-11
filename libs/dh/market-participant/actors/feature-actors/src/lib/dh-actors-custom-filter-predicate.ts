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
