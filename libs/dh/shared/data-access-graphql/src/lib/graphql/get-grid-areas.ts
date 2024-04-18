import { inject } from '@angular/core';
import { GetGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';

export function getGridAreaOptions(): Observable<WattDropdownOptions> {
  const apollo = inject(Apollo);
  return apollo.query({ query: GetGridAreasDocument }).pipe(
    map((result) => result.data?.gridAreas),
    exists(),
    map((gridAreas) =>
      gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: gridArea.displayName,
      }))
    )
  );
}
