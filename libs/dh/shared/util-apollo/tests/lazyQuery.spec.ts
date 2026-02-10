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
import { ApolloError } from '@apollo/client/core';
import { TestBed } from '@angular/core/testing';
import { gql } from '@apollo/client/core';
import { lazyQuery } from '../src/lib/lazyQuery';
import { withApollo } from './with-apollo';

const MOCK_DATA = { __type: { name: 'Query' } };
const TEST_QUERY = gql`
  query TestQuery($name: String! = "Query") {
    __type(name: $name) {
      name
    }
  }
`;

const it = test.extend(withApollo(MOCK_DATA));

describe('lazyQuery', () => {
  it('should not initialize query until called', () =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY);

      TestBed.tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(false);
    }));

  it('should be loading when query is called', () =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY);

      result.query();
      TestBed.tick();
      expect(result.loading()).toBe(true);
    }));

  it('should respond correctly on success', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = lazyQuery(TEST_QUERY);

      result.query();
      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(true);
    }));

  it('should trigger onCompleted callback', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onCompleted = vi.fn();
      const result = lazyQuery(TEST_QUERY, { onCompleted });

      result.query();
      await apollo.success();
      expect(onCompleted).toHaveBeenCalledWith(MOCK_DATA);
    }));

  it('should trigger onError callback', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onError = vi.fn();
      const result = lazyQuery(TEST_QUERY, { onError });

      result.query();
      await apollo.error();
      expect(onError).toHaveBeenCalled();
      expect(result.error()).toBeInstanceOf(ApolloError);
    }));

  it('should allow overriding options when calling query', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onCompleted = vi.fn();
      const result = lazyQuery(TEST_QUERY, { variables: { name: 'Query' } });

      result.query({ variables: { name: 'Mutation' }, onCompleted });
      await apollo.success();
      expect(onCompleted).toHaveBeenCalledWith(MOCK_DATA);
    }));
});
