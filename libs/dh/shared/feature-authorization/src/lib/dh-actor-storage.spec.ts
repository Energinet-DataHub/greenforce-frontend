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
import { LocalStorageFake, SessionStorageFake } from '@energinet-datahub/gf/test-util';

import { DhActorStorage, localStorageToken, sessionStorageToken } from './dh-actor-storage';
import { TestBed } from '@angular/core/testing';

describe(DhActorStorage, () => {
  const actorIds = ['18918674-D8EB-483F-94E8-CE241AB502E5', '898BF589-543C-42DA-8A72-120F0E263E86'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: localStorageToken,
          useFactory: () => new LocalStorageFake(),
        },
        {
          provide: sessionStorageToken,
          useFactory: () => new SessionStorageFake(),
        },
      ],
    });
  });

  test('return selected actor when set', () => {
    TestBed.runInInjectionContext(() => {
      // arrange
      const target = new DhActorStorage();

      target.setUserAssociatedActors(actorIds);

      // act
      target.setSelectedActorId(actorIds[1]);
      const actual = target.getSelectedActorId();

      // assert
      expect(actual).toBe(actorIds[1]);
    });
  });

  test('return first actor if no actor is set', () => {
    TestBed.runInInjectionContext(() => {
      // arrange
      const target = new DhActorStorage();

      target.setUserAssociatedActors(actorIds);

      // act
      const actual = target.getSelectedActorId();

      // assert
      expect(actual).toBe(actorIds[0]);
    });
  });
});
