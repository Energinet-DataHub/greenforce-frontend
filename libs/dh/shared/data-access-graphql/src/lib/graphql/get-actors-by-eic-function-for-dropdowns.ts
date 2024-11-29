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
