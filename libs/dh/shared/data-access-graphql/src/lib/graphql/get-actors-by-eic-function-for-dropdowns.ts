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
import { inject } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable, map } from 'rxjs';

import {
  EicFunction,
  GetActorsForEicFunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

export function getActorOptions(
  eicFunctions: EicFunction[],
  valueType: 'glnOrEicNumber' | 'actorId' = 'glnOrEicNumber'
): Observable<WattDropdownOptions> {
  const apollo = inject(Apollo);
  return apollo
    .query({
      query: GetActorsForEicFunctionDocument,
      variables: {
        eicFunctions,
      },
    })
    .pipe(
      map((result) => result.data?.actorsForEicFunction),
      exists(),
      map((actors) =>
        actors.map((actor) => ({
          value: valueType === 'glnOrEicNumber' ? actor.glnOrEicNumber : actor.id,
          displayValue: `${actor.glnOrEicNumber} • ${actor.name}`,
        }))
      )
    );
}
