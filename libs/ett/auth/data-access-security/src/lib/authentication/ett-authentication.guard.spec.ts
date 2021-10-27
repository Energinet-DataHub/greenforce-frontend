import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/feature-shell';
import { SpectacularAppComponent } from '@ngworker/spectacular';
import { render, RenderResult } from '@testing-library/angular';

import { EttAuthenticationGuard } from './ett-authentication.guard';

describe(EttAuthenticationGuard.name, () => {
  @Component({
    template: '',
  })
  class TestGuardedComponent {}

  @Component({
    template: '',
  })
  class TestLoginComponent {}

  beforeEach(async () => {
    view = await render(SpectacularAppComponent, {
      declarations: [TestGuardedComponent, TestLoginComponent],
      routes: [
        {
          canActivateChild: [EttAuthenticationGuard],
          path: '',
          children: [
            {
              path: guardedPath,
              component: TestGuardedComponent,
            },
          ],
        },
        {
          path: ettAuthRoutePath,
          component: TestLoginComponent,
        },
      ],
    });
    appLocation = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  let appLocation: Location;
  const guardedPath = 'guarded';
  let router: Router;
  let view: RenderResult<SpectacularAppComponent, SpectacularAppComponent>;

  describe('redirects to the login page', () => {
    it('when authentication fails', async () => {
      const authenticationError = {
        error: 'User failed to verify SSN',
        errorCode: 'E3',
      };
      const failedAuthentication = new URLSearchParams({
        error: authenticationError.error,
        error_code: authenticationError.errorCode,
        success: '0',
      });
      const expectedLoginUrl = router.serializeUrl(
        router.createUrlTree([ettAuthRoutePath], {
          queryParams: {
            error: authenticationError.error.replace(/ /g, '+'),
            error_code: authenticationError.errorCode,
            return_url: guardedPath,
          },
        })
      );

      await view.navigate('/?' + failedAuthentication, guardedPath);

      expect(decodeURIComponent(appLocation.path())).toBe(
        decodeURIComponent(expectedLoginUrl)
      );
    });
  });

  describe('allows navigation', () => {
    it('when authentication succeeds', async () => {
      const successfulAuthentication = {
        success: '1',
      };
      const expectedUrl = router.serializeUrl(
        router.createUrlTree([guardedPath], {
          queryParams: {
            success: successfulAuthentication.success,
          },
        })
      );

      await view.navigate(
        '/?' + new URLSearchParams(successfulAuthentication),
        guardedPath
      );

      expect(decodeURIComponent(appLocation.path())).toBe(
        decodeURIComponent(expectedUrl)
      );
    });

    it('when navigation does not follow authentication', async () => {
      const expectedUrl = router.serializeUrl(
        router.createUrlTree([guardedPath])
      );

      await view.navigate('/', guardedPath);

      expect(decodeURIComponent(appLocation.path())).toBe(
        decodeURIComponent(expectedUrl)
      );
    });
  });
});
