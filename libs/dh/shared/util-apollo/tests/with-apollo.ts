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
import type { Fixtures } from '@vitest/runner';
import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  Observable,
} from '@apollo/client/core';
import { GraphQLError } from 'graphql';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhApollo, isSubscription } from '@energinet-datahub/dh/shared/data-access-graphql';

export const withApollo = (
  data: Record<string, unknown>
): Fixtures<{
  apollo: {
    success: () => Promise<FetchResult>;
    error: () => Promise<FetchResult>;
    subscription: (data: Record<string, unknown>) => Promise<FetchResult>;
  };
}> => ({
  apollo: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const querySubject = new Subject<FetchResult>();
      const subscriptionSubject = new Subject<FetchResult>();
      const query$ = new Observable<FetchResult>((o) => querySubject.subscribe(o));
      const subscription$ = new Observable<FetchResult>((o) => subscriptionSubject.subscribe(o));
      const link = new ApolloLink((op) => (isSubscription(op) ? subscription$ : query$));
      const client = new ApolloClient({ link, cache: new InMemoryCache() });
      TestBed.configureTestingModule({ providers: [{ provide: DhApollo, useValue: { client } }] });

      await use({
        success: () =>
          new Promise((resolve) => {
            TestBed.tick();
            query$.subscribe(resolve);
            querySubject.next({ data });
          }),
        error: () =>
          new Promise((resolve) => {
            TestBed.tick();
            query$.subscribe(resolve);
            querySubject.next({ errors: [new GraphQLError('TestError')] });
          }),
        subscription: (data: Record<string, unknown>) =>
          new Promise((resolve) => {
            TestBed.tick();
            subscription$.subscribe(resolve);
            subscriptionSubject.next({ data });
          }),
      });

      querySubject.complete();
      subscriptionSubject.complete();
    },
    { auto: true },
  ],
});
