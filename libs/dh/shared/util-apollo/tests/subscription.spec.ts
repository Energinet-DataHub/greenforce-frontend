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
import { subscription } from '../src/lib/subscription';
import { withApollo } from './with-apollo';

const MOCK_DATA = { calculationUpdated: { id: '1' } };
const TEST_SUBSCRIPTION = gql`
  subscription TestSubscription {
    calculationUpdated {
      id
    }
  }
`;

const it = test.extend(withApollo(MOCK_DATA));

describe('subscription', () => {
  it('should have undefined data initially', () =>
    TestBed.runInInjectionContext(() => {
      const result = subscription(TEST_SUBSCRIPTION);

      TestBed.tick();
      expect(result.data()).toBeUndefined();
      expect(result.error()).toBeUndefined();
    }));

  it('should update data when subscription emits', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = subscription(TEST_SUBSCRIPTION);

      await apollo.subscription(MOCK_DATA);
      expect(result.data()).toEqual(MOCK_DATA);
      expect(result.error()).toBeUndefined();
    }));

  it('should trigger onData callback when data is received', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onData = vi.fn();
      const result = subscription(TEST_SUBSCRIPTION, { onData });

      await apollo.subscription(MOCK_DATA);
      expect(onData).toHaveBeenCalledWith(MOCK_DATA);
      expect(result.data()).toEqual(MOCK_DATA);
    }));

  it('should update error signal on GraphQL error', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const result = subscription(TEST_SUBSCRIPTION);

      await apollo.subscriptionError();
      expect(result.error()).toBeInstanceOf(ApolloError);
      expect(result.data()).toBeUndefined();
    }));

  it('should trigger onError callback on error', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onError = vi.fn();
      const result = subscription(TEST_SUBSCRIPTION, { onError });

      await apollo.subscriptionError();
      expect(onError).toHaveBeenCalled();
      expect(result.error()).toBeInstanceOf(ApolloError);
    }));

  it('should update data on multiple emissions', async ({ apollo }) =>
    TestBed.runInInjectionContext(async () => {
      const onData = vi.fn();
      const result = subscription(TEST_SUBSCRIPTION, { onData });

      await apollo.subscription({ calculationUpdated: { id: '1' } });
      expect(result.data()).toEqual({ calculationUpdated: { id: '1' } });
      expect(onData).toHaveBeenCalledTimes(1);

      await apollo.subscription({ calculationUpdated: { id: '2' } });
      expect(result.data()).toEqual({ calculationUpdated: { id: '2' } });
      expect(onData).toHaveBeenCalledTimes(2);

      await apollo.subscription({ calculationUpdated: { id: '3' } });
      expect(result.data()).toEqual({ calculationUpdated: { id: '3' } });
      expect(onData).toHaveBeenCalledTimes(3);
    }));
});
