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
import { test, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ApolloError, NetworkStatus, gql } from '@apollo/client/core';
import { query } from '../src/lib/query';
import { withApollo } from './with-apollo';

const MOCK_DATA = { __type: { name: 'Query' } };
const MOCK_SUBSCRIPTION_DATA = { data: { calculationUpdated: { id: '1' } } };
const TEST_QUERY = gql`
  query TestQuery($name: String! = "Query") {
    __type(name: $name) {
      name
    }
  }
`;

const TEST_SUBSCRIPTION = gql`
  subscription TestSubscription {
    calculationUpdated {
      id
    }
  }
`;

const it = test.extend(withApollo(MOCK_DATA));

describe('query', () => {
  it('should respond correctly initially', () =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);

      TestBed.tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(true);
      expect(result.networkStatus()).toBe(NetworkStatus.loading);
      expect(result.called()).toBe(true);
    }));

  it('should respond correctly on success', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(true);
    }));

  it('should respond correctly on error', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.error();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeInstanceOf(ApolloError);
      expect(result.hasError()).toBe(true);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.error);
      expect(result.called()).toBe(true);
    }));

  it('should respond correctly when skipped', () =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY, { skip: true });

      TestBed.tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(false);
    }));

  it('should respond correctly on refetch', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.success();
      expect(result.loading()).toBe(false);

      result.refetch();
      TestBed.tick();
      expect(result.loading()).toBe(true);

      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(true);
    }));

  it('should recover from error on refetch', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.error();
      expect(result.error()).toBeInstanceOf(ApolloError);
      expect(result.hasError()).toBe(true);
      expect(result.loading()).toBe(false);

      result.refetch();
      TestBed.tick();
      expect(result.loading()).toBe(true);

      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(true);
    }));

  it('should resolve with ApolloQueryResult on refetch', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.success();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(true);

      const promise = result.refetch();
      await apollo.success();
      expect(await promise).toEqual({
        data: MOCK_DATA,
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    }));

  it('should start a new query on setOptions', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY, { skip: true });

      TestBed.tick();
      expect(result.called()).toBe(false);

      result.setOptions({ fetchPolicy: 'network-only' });
      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(true);
    }));

  it('should resolve with ApolloQueryResult on setOptions', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.success();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(true);

      const promise = result.setOptions({ fetchPolicy: 'network-only' });
      await apollo.success();
      expect(await promise).toEqual({
        data: MOCK_DATA,
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    }));

  it('should clear result after reset', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);

      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);

      result.reset();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.hasError()).toBe(false);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(false);
    }));

  it('should not call updateQuery while query is loading', ({ apollo }) =>
    TestBed.runInInjectionContext(() => {
      const onUpdateQuery = vi.fn((x) => x);
      const result = query(TEST_QUERY);
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      apollo.subscription({ calculationUpdated: { id: '1' } });
      expect(result.loading()).toBe(true);
      expect(onUpdateQuery).not.toHaveBeenCalled();
    }));

  it('should not call updateQuery while query is refetching', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onUpdateQuery = vi.fn((x) => x);
      const result = query(TEST_QUERY);
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      await apollo.success();
      expect(result.loading()).toBe(false);

      result.refetch();
      apollo.subscription({ calculationUpdated: { id: '1' } });
      expect(result.loading()).toBe(true);
      expect(onUpdateQuery).not.toHaveBeenCalled();
    }));

  it('should call updateQuery when initial query is complete', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onUpdateQuery = vi.fn((x) => x);
      const result = query(TEST_QUERY);
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      await apollo.subscription(MOCK_SUBSCRIPTION_DATA.data);
      expect(onUpdateQuery).not.toHaveBeenCalled();

      await apollo.success();
      expect(result.loading()).toBe(false);
      await expect
        .poll(() => onUpdateQuery)
        .toHaveBeenCalledWith(MOCK_DATA, {
          complete: true,
          previousData: MOCK_DATA,
          subscriptionData: MOCK_SUBSCRIPTION_DATA,
          variables: undefined,
        });
    }));

  it('should call updateQuery when refetch is complete', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onUpdateQuery = vi.fn((x) => x);
      const result = query(TEST_QUERY, { skip: true });
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      await apollo.subscription(MOCK_SUBSCRIPTION_DATA.data);
      result.refetch();
      await apollo.success();
      expect(result.loading()).toBe(false);
      await expect
        .poll(() => onUpdateQuery)
        .toHaveBeenCalledWith(MOCK_DATA, {
          complete: true,
          previousData: MOCK_DATA,
          subscriptionData: MOCK_SUBSCRIPTION_DATA,
          variables: undefined,
        });
    }));

  it('should only call updateQuery once per data emitted', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onUpdateQuery = vi.fn((x) => x);
      const result = query(TEST_QUERY);
      await apollo.success();
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });
      await apollo.subscription(MOCK_SUBSCRIPTION_DATA.data);
      await expect.poll(() => onUpdateQuery).toHaveBeenCalledTimes(1);

      result.refetch();
      await apollo.success();
      expect(result.loading()).toBe(false);
      expect(onUpdateQuery).toHaveBeenCalledTimes(1);
      expect(onUpdateQuery).toHaveBeenCalledWith(MOCK_DATA, {
        complete: true,
        previousData: MOCK_DATA,
        subscriptionData: MOCK_SUBSCRIPTION_DATA,
        variables: undefined,
      });
    }));
});
