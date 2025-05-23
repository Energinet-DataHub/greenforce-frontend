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
import { computed, inject, Signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

type MarketParticipant = ResultOf<
  typeof GetActorsForEicFunctionDocument
>['actorsForEicFunction'][0];

import {
  EicFunction,
  GetActorsForEicFunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

export function getActorOptions(
  eicFunctions: EicFunction[],
  valueType: 'glnOrEicNumber' | 'actorId' = 'glnOrEicNumber'
): Observable<WattDropdownOptions> {
  return inject(Apollo)
    .query({
      query: GetActorsForEicFunctionDocument,
      variables: {
        eicFunctions,
      },
    })
    .pipe(
      map((result) => result.data?.actorsForEicFunction),
      exists(),
      map((actors) => toDropdownOptions(actors, valueType))
    );
}

export function getActorOptionsSignal(
  eicFunctions: EicFunction[],
  valueType: 'glnOrEicNumber' | 'actorId' = 'glnOrEicNumber'
): Signal<WattDropdownOptions> {
  const queryResult = query(GetActorsForEicFunctionDocument, { variables: { eicFunctions } });

  return computed(() => {
    const actors = queryResult.data()?.actorsForEicFunction ?? [];

    return toDropdownOptions(actors, valueType);
  });
}

function toDropdownOptions(
  values: MarketParticipant[],
  valueType: 'glnOrEicNumber' | 'actorId' = 'glnOrEicNumber'
): WattDropdownOptions {
  return values.map((value) => ({
    value: valueType === 'glnOrEicNumber' ? value.glnOrEicNumber : value.id,
    displayValue: `${value.glnOrEicNumber} • ${value.name}`,
  }));
}
