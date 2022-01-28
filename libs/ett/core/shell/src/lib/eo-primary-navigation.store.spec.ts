import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/landing-page/routing';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { EoPrimaryNavigationStore } from './eo-primary-navigation.store';

describe(EoPrimaryNavigationStore.name, () => {
  describe('Given Auth API accepts log out', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          EoPrimaryNavigationStore,
          MockProvider(AuthHttp, {
            getLogout: () => of({ success: true }),
          }),
          MockProvider(Router),
        ],
      });

      store = TestBed.inject(EoPrimaryNavigationStore);
    });

    let store: EoPrimaryNavigationStore;

    it(`When log out is triggered
      Then the user is redirected to the landing page`, () => {
      const router = TestBed.inject(Router);

      store.onLogOut();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        eoLandingPageRelativeUrl
      );
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    });
  });
});
