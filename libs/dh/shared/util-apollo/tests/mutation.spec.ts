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
import { mutation } from '../src/lib/mutation';
import { withApollo } from './with-apollo';

const MOCK_DATA = { __typename: 'Mutation' };
const TEST_MUTATION = gql`
  mutation TestMutation {
    __typename
  }
`;

const it = test.extend(withApollo(MOCK_DATA));

describe('mutation', () => {
  it('should not initialize mutation until called', () =>
    TestBed.runInInjectionContext(() => {
      const result = mutation(TEST_MUTATION);

      TestBed.tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(false);
    }));

  it('should be loading when mutate is called', () =>
    TestBed.runInInjectionContext(async () => {
      const result = mutation(TEST_MUTATION);

      result.mutate();
      TestBed.tick();
      expect(result.loading()).toBe(true);
    }));

  it('should update loading correctly on success', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = mutation(TEST_MUTATION);

      TestBed.tick();
      expect(result.loading()).toBe(false);

      result.mutate();
      TestBed.tick();
      expect(result.loading()).toBe(true);

      await apollo.success();
      expect(result.loading()).toBe(false);
    }));

  it('should set called to true after mutation completes', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = mutation(TEST_MUTATION);

      TestBed.tick();
      expect(result.called()).toBe(false);

      result.mutate();
      await apollo.success();
      expect(result.called()).toBe(true);
    }));

  it('should trigger onCompleted callback', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onCompleted = vi.fn();
      const config = { onCompleted };
      const result = mutation(TEST_MUTATION, config);

      result.mutate();
      await apollo.success();
      expect(onCompleted).toHaveBeenCalledWith(MOCK_DATA, config);
    }));

  it('should trigger onError callback', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onError = vi.fn();
      const result = mutation(TEST_MUTATION, { onError });

      result.mutate();
      await apollo.error();
      expect(onError).toHaveBeenCalled();
      expect(result.error()).toBeInstanceOf(ApolloError);
    }));

  it('should clear result after reset', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = mutation(TEST_MUTATION);

      result.mutate();
      await apollo.success();
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.called()).toBe(true);

      result.reset();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
      expect(result.loading()).toBe(false);
      expect(result.called()).toBe(false);
    }));
});
