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
      const op = controller.expectOne(TEST_QUERY);
      expect(op.operation.operationName).toEqual('TestQuery');
    })));

  it('should respond correctly initially', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      controller.expectOne(TEST_QUERY);
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(true);
      expect(result.networkStatus()).toBe(NetworkStatus.loading);
    })));

  it('should respond correctly on success', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      expect(result.data()).toEqual(data);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
    })));

  it('should respond correctly on error', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      const op = controller.expectOne(TEST_QUERY);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeInstanceOf(ApolloError);
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.error);
    })));

  it('should respond correctly when skipped', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY, { skip: true });
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
    })));

  it('should start a new query on refetch', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
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
    })));

  it('should start a new query on refetch after it has errored', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
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
      expect(result.loading()).toBe(false);
    })));

  it('should start a new query on setOptions', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY, { skip: true });
      result.setOptions({ fetchPolicy: 'network-only' });
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      expect(result.data()).toEqual(data);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
    })));

  it('should clear result after reset', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = query(TEST_QUERY);
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      result.reset();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.networkStatus()).toBe(NetworkStatus.ready);
    })));
});
