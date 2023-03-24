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

import { LocalStorageFake } from '@energinet-datahub/dh/shared/test-util-auth';
import { ActorStorage } from './actor-storage';

describe(ActorStorage.name, () => {
  const ids = ['18918674-D8EB-483F-94E8-CE241AB502E5', '898BF589-543C-42DA-8A72-120F0E263E86'];

  test('should return selected if set', async () => {
    // arrange
    const target = new ActorStorage(new LocalStorageFake());

    target.setUserAssociatedActors(ids);

    // act
    target.setSelectedActor(ids[1]);
    const actual = target.getSelectedActor();

    // assert
    expect(actual).toBe(ids[1]);
  });

  test('should return first actor if non selected', async () => {
    // arrange
    const target = new ActorStorage(new LocalStorageFake());

    target.setUserAssociatedActors(ids);

    // act
    const actual = target.getSelectedActor();

    // assert
    expect(actual).toBe(ids[0]);
  });
});
