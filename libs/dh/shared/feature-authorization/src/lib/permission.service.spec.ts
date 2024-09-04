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
import { firstValueFrom, of } from 'rxjs';

import { PermissionService } from './permission.service';
import { DhActorTokenService } from './dh-actor-token.service';
import { TestBed } from '@angular/core/testing';

describe(PermissionService, () => {
  // base64 encoded access token: { role: ['actors:manage'] }
  const fakeAccessToken = 'ignored.eyJyb2xlIjpbImFjdG9yczptYW5hZ2UiXX0';

  test('should return true if permission is found within access token roles', async () => {
    // arrange
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DhActorTokenService,
          useValue: { acquireToken: () => of(fakeAccessToken) },
        },
      ],
    });

    // act
    await TestBed.runInInjectionContext(async () => {
      const target = new PermissionService();
      const actual = await firstValueFrom(target.hasPermission('actors:manage'));

      // assert
      expect(actual).toBe(true);
    });
  });

  test('should return false if permission is not found within access token roles', async () => {
    // arrange
    // arrange
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DhActorTokenService,
          useValue: { acquireToken: () => of(fakeAccessToken) },
        },
      ],
    });

    // act
    await TestBed.runInInjectionContext(async () => {
      const target = new PermissionService();
      const actual = await firstValueFrom(target.hasPermission('grid-areas:manage'));
      // assert
      expect(actual).toBe(false);
    });
  });
});
