/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  ConnectionState,
  connectionStateToBadgeType,
} from './connection-state-to-badge-type';

describe(connectionStateToBadgeType.prototype.name, () => {
  it(`Given connection state is "Not used"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.NotUsed);

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "Disconnected"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(
      ConnectionState.Disconnected
    );

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "Closed down"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(
      ConnectionState.ClosedDown
    );

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "Connected"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(
      ConnectionState.Connected
    );

    expect(actualBadgeType).toBe('success');
  });

  it(`Given connection state is "New"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.New);

    expect(actualBadgeType).toBe('success');
  });

  it(`When an unknown connection state is specified
    Then an error is thrown"`, () => {
    expect(() => connectionStateToBadgeType('test')).toThrowError(
      /unknown connection state/i
    );
  });
});
