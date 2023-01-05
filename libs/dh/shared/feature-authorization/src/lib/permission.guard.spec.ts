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

import { PermissionService } from './permission.service';
import { firstValueFrom, of } from 'rxjs';
import { inject } from '@angular/core/testing';
import { permissionGuardCore } from './permission.guard';

describe(PermissionService.name, () => {
  const permissionService: Partial<PermissionService> = {
    hasPermission: (permission) => of(permission === 'actor:manage'),
  };

  test('should return true if one of the permissions is present', async () => {
    // arrange
    inject([PermissionService], (injectService: PermissionService) => {
      expect(injectService).toBe(permissionService);
    });

    const target = permissionGuardCore;

    // act
    const actual = await firstValueFrom(
      target(
        ['gridareas:manage', 'actor:manage'],
        permissionService as PermissionService
      )
    );

    // assert
    expect(actual).toEqual(true);
  });

  test('should return false if none of the permissions is present', async () => {
    // arrange
    inject([PermissionService], (injectService: PermissionService) => {
      expect(injectService).toBe(permissionService);
    });

    const target = permissionGuardCore;

    // act
    const actual = await firstValueFrom(
      target(['gridareas:manage'], permissionService as PermissionService)
    );

    // assert
    expect(actual).toEqual(false);
  });
});
