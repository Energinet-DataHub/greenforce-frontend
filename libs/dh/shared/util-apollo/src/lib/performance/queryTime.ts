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
import { effect, linkedSignal, signal } from '@angular/core';
import { OperationVariables } from '@apollo/client/core';
import { assert, assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { ObjectType, QueryResult, QueryStatus } from '../query';

/** Measures the time it takes for a query to complete. */
export function queryTime<TResult extends ObjectType>(
  query: QueryResult<TResult, OperationVariables>
) {
  // Check if the performance API is available
  if (typeof window.performance.measure !== 'function') return signal(undefined);

  // Assert that queryTime is only used with proper operation definitions
  const document = query.getDocument();
  const operation = document.definitions[0];
  assert(document.definitions.length === 1);
  assert(operation.kind === 'OperationDefinition');
  assertIsDefined(operation.name);

  // Create named markers based on operation name
  const startMark = operation.name.value + '-query-start';
  const endMark = operation.name.value + '-query-end';
  const measureName = operation.name.value + 'queryTime';

  effect(() => {
    switch (query.status()) {
      case 'idle':
        break;
      case 'loading':
        performance.mark(startMark);
        break;
      case 'resolved':
      case 'error':
        performance.mark(endMark);
        break;
    }
  });

  return linkedSignal<QueryStatus, number | undefined>({
    source: query.status,
    computation: (_, prev) => {
      query.status(); // tracked dependency
      const startMarks = performance.getEntriesByName(startMark);
      const endMarks = performance.getEntriesByName(endMark);
      return startMarks.length > 0 && startMarks.length === endMarks.length
        ? performance.measure(measureName, startMark, endMark).duration
        : prev?.value;
    },
  }).asReadonly();
}
