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
