import { inject } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { PermissionService } from './permission.service';
import { permissionGuardCore } from './permission.guard';

describe(PermissionService, () => {
  const permissionService: Partial<PermissionService> = {
    hasPermission: (permission) => of(permission === 'actors:manage'),
  };

  test('should return true if one of the permissions is present', async () => {
    // arrange
    inject([PermissionService], (injectService: PermissionService) => {
      expect(injectService).toBe(permissionService);
    });

    const target = permissionGuardCore;

    // act
    const actual = await firstValueFrom(
      target(['grid-areas:manage', 'actors:manage'], permissionService as PermissionService)
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
      target(['grid-areas:manage'], permissionService as PermissionService)
    );

    // assert
    expect(actual).toEqual(false);
  });
});
