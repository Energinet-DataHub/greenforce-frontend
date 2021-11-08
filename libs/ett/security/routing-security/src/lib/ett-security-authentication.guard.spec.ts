import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthOidcQueryParameterName } from '@energinet-datahub/ett/auth/data-access-api';
import { ettAuthRoutePath } from '@energinet-datahub/ett/auth/shell-auth';
import { SpectacularAppComponent } from '@ngworker/spectacular';
import { render, RenderResult } from '@testing-library/angular';

import { EttAuthenticationGuard } from './ett-security-authentication.guard';

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
              children: [
                {
                  path: 'test',
                  component: TestGuardedComponent,
                },
              ],
            },
          ],
        },
        {
          path: ettAuthRoutePath,
          component: TestLoginComponent,
        },
      ],
    });
    angularLocation = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  let angularLocation: Location;
  const guardedPath = 'guarded';
  let router: Router;
  let view: RenderResult<SpectacularAppComponent, SpectacularAppComponent>;

  describe('When user authentication fails', () => {
    it('Then the user is redirected to the login page', async () => {
      const authenticationError = {
        error: 'User failed to verify SSN',
        errorCode: 'E3',
      };
      const failedAuthentication = new URLSearchParams({
        [AuthOidcQueryParameterName.Error]: authenticationError.error,
        [AuthOidcQueryParameterName.ErrorCode]: authenticationError.errorCode,
        [AuthOidcQueryParameterName.Success]: '0',
      });
      const expectedLoginUrl = router.serializeUrl(
        router.createUrlTree([ettAuthRoutePath], {
          queryParams: {
            [AuthOidcQueryParameterName.Error]:
              authenticationError.error.replace(/ /g, '+'),
            [AuthOidcQueryParameterName.ErrorCode]:
              authenticationError.errorCode,
            [AuthOidcQueryParameterName.ReturnUrl]: `http://localhost/${guardedPath}/test`,
          },
        })
      );

      await view.navigate('/test/?' + failedAuthentication, guardedPath);

      expect(decodeURIComponent(angularLocation.path())).toBe(
        decodeURIComponent(expectedLoginUrl)
      );
    });
  });

  describe('When user authenticates', () => {
    it('Then navigation is allowed', async () => {
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

      expect(decodeURIComponent(angularLocation.path())).toBe(
        decodeURIComponent(expectedUrl)
      );
    });
  });

  describe('Given a user who has not attempted to authenticate', () => {
    it('Then navigation is allowed', async () => {
      const expectedUrl = router.serializeUrl(
        router.createUrlTree([guardedPath])
      );

      await view.navigate('/', guardedPath);

      expect(decodeURIComponent(angularLocation.path())).toBe(
        decodeURIComponent(expectedUrl)
      );
    });
  });
});
