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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { gql } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { query } from './query';
import { ApolloError, NetworkStatus } from '@apollo/client/core';
import { GraphQLError } from 'graphql';

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

describe('query', () => {
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => controller.verify());

  it('should initialize query', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      query(TEST_QUERY);
      tick();
      const op = controller.expectOne(TEST_QUERY);
      expect(op.operation.operationName).toEqual('TestQuery');
    })));

  it('should respond correctly initially', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      tick();
      controller.expectOne(TEST_QUERY);
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(true);
      expect(result.networkStatus()).toBe(NetworkStatus.loading);
      expect(result.called()).toBe(true);
    })));

  it('should respond correctly on success', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      tick();
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      expect(result.data()).toEqual(data);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(true);
    })));

  it('should respond correctly on error', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      tick();
      const op = controller.expectOne(TEST_QUERY);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeInstanceOf(ApolloError);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.error);
      expect(result.called()).toBe(true);
    })));

  it('should respond correctly when skipped', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY, { skip: true });
      tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(false);
    })));

  it('should start a new query on refetch', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      tick();
      const queryOp = controller.expectOne(TEST_QUERY);

      result.refetch({ name: 'Mutation' });
      const mutationOp = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Mutation' } };
      mutationOp.flush({ data });
      tick();

      expect(queryOp.operation.variables['name']).toEqual('Query');
      expect(mutationOp.operation.variables['name']).toEqual('Mutation');
      expect(result.data()).toEqual(data);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(true);
    })));

  it('should start a new query on refetch after it has errored', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      tick();
      const op = controller.expectOne(TEST_QUERY);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();

      expect(result.error()).toBeInstanceOf(ApolloError);
      expect(result.loading()).toBe(false);

      result.refetch();

      const newOp = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Success' } };
      newOp.flush({ data });
      tick();

      expect(result.data()).toEqual(data);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(true);
    })));

  it('should resolve with ApolloQueryResult on refetch', fakeAsync(() =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);
      tick();
      const queryOp = controller.expectOne(TEST_QUERY);
      const queryData = { __type: { name: 'Query' } };
      queryOp.flush({ data: queryData });
      tick();

      const promise = result.refetch();
      const mutationOp = controller.expectOne(TEST_QUERY);
      const mutationData = { __type: { name: 'Mutation' } };
      mutationOp.flush({ data: mutationData });
      tick();

      expect(await promise).toEqual({
        data: mutationData,
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    })));

  it('should start a new query on setOptions', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY, { skip: true });
      tick();
      result.setOptions({ fetchPolicy: 'network-only' });
      tick();
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      expect(result.data()).toEqual(data);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(true);
    })));

  it('should resolve with ApolloQueryResult on setOptions', fakeAsync(() =>
    TestBed.runInInjectionContext(async () => {
      const result = query(TEST_QUERY);
      tick();
      const queryOp = controller.expectOne(TEST_QUERY);
      const queryData = { __type: { name: 'Query' } };
      queryOp.flush({ data: queryData });
      tick();

      const promise = result.setOptions({ fetchPolicy: 'network-only' });
      const mutationOp = controller.expectOne(TEST_QUERY);
      const mutationData = { __type: { name: 'Mutation' } };
      mutationOp.flush({ data: mutationData });
      tick();

      expect(await promise).toEqual({
        data: mutationData,
        loading: false,
        networkStatus: NetworkStatus.ready,
      });
    })));

  it('should clear result after reset', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      tick();
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      result.reset();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
      expect(result.called()).toBe(false);
    })));

  it('should not call updateQuery while query is loading', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onUpdateQuery = jest.fn((x) => x);
      const result = query(TEST_QUERY);
      tick();
      controller.expectOne(TEST_QUERY);

      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });
      const subscriptionOp = controller.expectOne(TEST_SUBSCRIPTION);
      const subscriptionData = { data: { calculationUpdated: { id: '1' } } };
      subscriptionOp.flush(subscriptionData);
      tick();

      expect(result.loading()).toBe(true);
      expect(onUpdateQuery).not.toHaveBeenCalled();
    })));

  it('should not call updateQuery while query is refetching', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onUpdateQuery = jest.fn((x) => x);
      const result = query(TEST_QUERY);
      tick();
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      const initialQueryOp = controller.expectOne(TEST_QUERY);
      const queryData = { __type: { name: 'Query' } };
      initialQueryOp.flush({ data: queryData });
      tick();

      result.refetch();
      controller.expectOne(TEST_QUERY);
      tick();

      const subscriptionOp = controller.expectOne(TEST_SUBSCRIPTION);
      const subscriptionData = { data: { calculationUpdated: { id: '1' } } };
      subscriptionOp.flush(subscriptionData);
      tick();

      expect(result.loading()).toBe(true);
      expect(onUpdateQuery).not.toHaveBeenCalled();
    })));

  it('should call updateQuery when initial query is complete', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onUpdateQuery = jest.fn((x) => x);
      const result = query(TEST_QUERY);
      tick();
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      const subscriptionOp = controller.expectOne(TEST_SUBSCRIPTION);
      const subscriptionData = { data: { calculationUpdated: { id: '1' } } };
      subscriptionOp.flush(subscriptionData);
      tick();

      const queryOp = controller.expectOne(TEST_QUERY);
      const queryData = { __type: { name: 'Query' } };
      queryOp.flush({ data: queryData });
      tick();

      expect(result.loading()).toBe(false);
      expect(onUpdateQuery).toHaveBeenCalledWith(queryData, {
        subscriptionData,
        variables: undefined,
      });
    })));

  it('should call updateQuery when refetch is complete', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onUpdateQuery = jest.fn((x) => x);
      const result = query(TEST_QUERY, { skip: true });
      tick();
      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });

      const subscriptionOp = controller.expectOne(TEST_SUBSCRIPTION);
      const subscriptionData = { data: { calculationUpdated: { id: '1' } } };
      subscriptionOp.flush(subscriptionData);
      tick();

      result.refetch();
      const queryOp = controller.expectOne(TEST_QUERY);
      const queryData = { __type: { name: 'Query' } };
      queryOp.flush({ data: queryData });
      tick();

      expect(result.loading()).toBe(false);
      expect(onUpdateQuery).toHaveBeenCalledWith(queryData, {
        subscriptionData,
        variables: undefined,
      });
    })));

  it('should only call updateQuery once per data emitted', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onUpdateQuery = jest.fn((x) => x);
      const result = query(TEST_QUERY);
      tick();
      const initialQueryOp = controller.expectOne(TEST_QUERY);
      const queryData = { __type: { name: 'Query' } };
      initialQueryOp.flush({ data: queryData });
      tick();

      result.subscribeToMore({ document: TEST_SUBSCRIPTION, updateQuery: onUpdateQuery });
      const subscriptionOp = controller.expectOne(TEST_SUBSCRIPTION);
      const subscriptionData = { data: { calculationUpdated: { id: '1' } } };
      subscriptionOp.flush(subscriptionData);
      tick();

      result.refetch();
      const refetchQueryOp = controller.expectOne(TEST_QUERY);
      refetchQueryOp.flush({ data: queryData });
      tick();

      expect(result.loading()).toBe(false);
      expect(onUpdateQuery).toHaveBeenCalledTimes(1);
      expect(onUpdateQuery).toHaveBeenCalledWith(queryData, {
        subscriptionData,
        variables: undefined,
      });
    })));
});
