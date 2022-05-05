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
import { ConnectionState } from '@energinet-datahub/dh/shared/domain';

import { connectionStateToBadgeType } from './connection-state-to-badge-type';

describe(connectionStateToBadgeType.prototype.name, () => {
  it(`Given connection state is "${ConnectionState.D02}"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.D02);

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "${ConnectionState.E23}"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.E23);

    expect(actualBadgeType).toBe('warning');
  });

  it(`Given connection state is "${ConnectionState.E22}"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.E22);

    expect(actualBadgeType).toBe('success');
  });

  it(`Given connection state is "${ConnectionState.D03}"
    Then badge type is "warning"`, () => {
    const actualBadgeType = connectionStateToBadgeType(ConnectionState.D03);

    expect(actualBadgeType).toBe('success');
  });

  it(`When an unknown connection state is specified
    Then an error is thrown"`, () => {
    const unknowConnectionState = 'TEST' as ConnectionState;

    expect(() =>
      connectionStateToBadgeType(unknowConnectionState)
    ).toThrowError(/unknown connection state/i);
  });
});
