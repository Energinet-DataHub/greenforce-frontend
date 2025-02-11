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

import { GetGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

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

export function getGridAreaOptionsSignal(): Signal<WattDropdownOptions> {
  const getGridAreaQuery = query(GetGridAreasDocument);
  return computed(() => {
    const gridAreas = getGridAreaQuery.data()?.gridAreas ?? [];
    return gridAreas.map((gridArea) => ({
      value: gridArea.code,
      displayValue: gridArea.displayName,
    }));
  });
}
