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
import { mutation } from './mutation';
import { GraphQLError } from 'graphql';

const TEST_MUTATION = gql`
  mutation TestMutation {
    __typename
  }
`;

describe('mutation', () => {
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => controller.verify());

  it('should not initialize mutation', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      mutation(TEST_MUTATION);
      controller.expectNone(TEST_MUTATION);
    })));

  it('should initialize mutation when called', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = mutation(TEST_MUTATION);
      result.mutate();
      controller.expectOne(TEST_MUTATION);
    })));

  it('should trigger onCompleted', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onCompleted = jest.fn();
      const config = { onCompleted };
      const result = mutation(TEST_MUTATION, config);
      result.mutate();
      const op = controller.expectOne(TEST_MUTATION);
      const data = { __typename: 'Mutation' };
      op.flush({ data });
      tick();
      expect(onCompleted).toHaveBeenCalledWith(data, config);
    })));

  it('should trigger onError', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onError = jest.fn();
      const result = mutation(TEST_MUTATION, { onError });
      result.mutate();
      const op = controller.expectOne(TEST_MUTATION);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();
      expect(onError).toHaveBeenCalled();
    })));

  it('should respond with initial data after reset', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = mutation(TEST_MUTATION);
      result.mutate();
      const op = controller.expectOne(TEST_MUTATION);
      const data = { __typename: 'Mutation' };
      op.flush({ data });
      tick();
      result.reset();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
    })));
});
