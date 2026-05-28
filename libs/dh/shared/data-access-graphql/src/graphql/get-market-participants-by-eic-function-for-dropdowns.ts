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
/* eslint-disable @nx/enforce-module-boundaries */
import { computed, Signal } from '@angular/core';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WattDropdownOptions } from '@energinet/watt/dropdown';

type MarketParticipant = ResultOf<
  typeof GetMarketParticipantsForEicFunctionDocument
>['marketParticipantsForEicFunction'][0];

type ValueType = 'glnOrEicNumber' | 'actorId';
type DisplayNameType = 'displayName' | 'displayNameWithoutMarketRole';

import {
  EicFunction,
  GetMarketParticipantsForEicFunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';

export function getActorOptions(
  eicFunctions: EicFunction[],
  valueType: ValueType = 'glnOrEicNumber',
  displayNameType: DisplayNameType = 'displayName'
): Signal<WattDropdownOptions> {
  const queryResult = query(GetMarketParticipantsForEicFunctionDocument, {
    variables: { eicFunctions },
  });

  return computed(() => {
    const actors = queryResult.data()?.marketParticipantsForEicFunction ?? [];

    return toDropdownOptions(actors, valueType, displayNameType);
  });
}

function toDropdownOptions(
  values: MarketParticipant[],
  valueType: ValueType = 'glnOrEicNumber',
  displayNameType: DisplayNameType = 'displayName'
): WattDropdownOptions {
  return values.map((value) => ({
    value: valueType === 'glnOrEicNumber' ? value.glnOrEicNumber : value.id,
    displayValue:
      displayNameType === 'displayName' ? value.displayName : value.displayNameWithoutMarketRole,
  }));
}
