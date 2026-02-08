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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { gql } from '@apollo/client/core';
import { GraphQLError } from 'graphql';
import { vi } from 'vitest';
import { lazyQuery } from './lazyQuery';
import { ApolloTestingController, setupApolloTesting } from './testing/apollo-testing';

const TEST_QUERY = gql`
  query TestQuery($name: String! = "Query") {
    __type(name: $name) {
      name
    }
  }
`;

describe('lazyQuery', () => {
  let controller: ApolloTestingController;

  beforeEach(() => {
    const apollo = setupApolloTesting();
    controller = apollo.controller;
    TestBed.configureTestingModule({
      providers: apollo.providers,
    });
  });

  afterEach(() => controller.verify());

  it('should not initialize query', () =>
    TestBed.runInInjectionContext(() => {
      lazyQuery(TEST_QUERY);
      controller.expectNone(TEST_QUERY);
    }));

  it('should initialize query when called', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY);
      result.query();
      tick();
      controller.expectOne(TEST_QUERY);
    })));

  it('should trigger onCompleted', fakeAsync(() =>
    TestBed.runInInjectionContext(async () => {
      const onCompleted = vi.fn();
      const result = lazyQuery(TEST_QUERY, { onCompleted });
      const queryPromise = result.query();
      tick();
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      await queryPromise;
      expect(onCompleted).toHaveBeenCalledWith(data);
    })));

  it('should trigger onError', fakeAsync(() =>
    TestBed.runInInjectionContext(async () => {
      const onError = vi.fn();
      const result = lazyQuery(TEST_QUERY, { onError });
      const queryPromise = result.query();
      tick();
      const op = controller.expectOne(TEST_QUERY);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();
      await queryPromise;
      expect(onError).toHaveBeenCalled();
    })));

  it('should override options', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY, { variables: { name: 'Query' } });
      result.query({ variables: { name: 'Mutation' } });
      tick();
      const op = controller.expectOne(TEST_QUERY);
      expect(op.operation.variables['name']).toEqual('Mutation');
    })));
});
