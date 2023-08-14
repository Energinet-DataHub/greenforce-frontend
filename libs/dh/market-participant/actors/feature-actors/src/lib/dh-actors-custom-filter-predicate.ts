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
import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

import { AllFiltersCombined } from './actors-filters';
import { DhActor } from './dh-actor';
import { dhParseJSON } from './dh-json-util';

/**
 * Custom filter predicate function that runs for each actor in the table.
 *
 * @returns `true` if an actor should be shown in the table, `false` otherwise.
 */
export const dhActorsCustomFilterPredicate = () => {
  // Intentionally disable complexity rule for this function
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return (actor: DhActor, filtersJSON: string): boolean => {
    const filters: AllFiltersCombined = dhParseJSON(filtersJSON);

    // If all filters are at their initial state (`null` or "" (empty string)), show actor
    if (Object.values(filters).every((filter) => filter === null || filter === '')) {
      return true;
    }

    // If a filter is set, but some of the actor's properties are `null`/`undefined`, do not show actor
    if (actor.status == null || actor.marketRole == null) {
      return false;
    }

    let showActor = true;

    if (showActor && filters.actorStatus !== null) {
      showActor = filters.actorStatus.includes(actor.status);
    }

    if (showActor && filters.marketRoles !== null) {
      showActor = filters.marketRoles.includes(actor.marketRole as EicFunction);
    }

    if (showActor && filters.searchInput !== '') {
      showActor =
        actor.glnOrEicNumber.includes(filters.searchInput) ||
        actor.name.toLocaleLowerCase().includes(filters.searchInput.toLocaleLowerCase());
    }

    return showActor;
  };
};
