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
import { lazyQuery } from './lazyQuery';
import { GraphQLError } from 'graphql';

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
    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => controller.verify());

  it('should not initialize query', () =>
    TestBed.runInInjectionContext(() => {
      lazyQuery(TEST_QUERY);
      controller.expectNone(TEST_QUERY);
    }));

  it('should initialize query when called', () =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY);
      result.query();
      controller.expectOne(TEST_QUERY);
    }));

  it('should trigger onCompleted', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onCompleted = jest.fn();
      const result = lazyQuery(TEST_QUERY, { onCompleted });
      result.query();
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      expect(onCompleted).toHaveBeenCalledWith(data);
    })));

  it('should trigger onError', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onError = jest.fn();
      const result = lazyQuery(TEST_QUERY, { onError });
      result.query();
      const op = controller.expectOne(TEST_QUERY);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();
      expect(onError).toHaveBeenCalled();
    })));

  it('should override options', () =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY, { variables: { name: 'Query' } });
      result.query({ variables: { name: 'Mutation' } });
      const op = controller.expectOne(TEST_QUERY);
      expect(op.operation.variables['name']).toEqual('Mutation');
    }));
});
