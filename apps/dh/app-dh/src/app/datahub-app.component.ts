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
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TranslocoService } from '@ngneat/transloco';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  CookieInformationService,
  CookieInformationCulture,
} from '@energinet-datahub/gf/util-cookie-information';

@Component({
  // Intentionally use full product name prefix for the root component
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'datahub-app',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `<router-outlet />`,
  standalone: true,
  imports: [RouterOutlet],
})
export class DataHubAppComponent implements OnInit {
  private cookieInformationService = inject(CookieInformationService);
  private transloco = inject(TranslocoService);
  private appInsights = inject(DhApplicationInsights);
  private destroyRef = inject(DestroyRef);
  private authService = inject(MsalService);
  private router = inject(Router);

  ngOnInit(): void {
    // Initialize cookie information
    this.cookieInformationService.init({
      culture: this.transloco.getActiveLang() as CookieInformationCulture,
    });

    // Reload cookie information on language changes
    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.cookieInformationService.reInit({
        culture: lang as CookieInformationCulture,
      });
    });

    // Get the initial consent status and future changes
    this.cookieInformationService.consentGiven$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        console.log('setting cookies usage', status);
        this.appInsights.setCookiesUsage(status.cookie_cat_statistic);
      });

    this.authService.handleRedirectObservable().subscribe((data) => {
      if (data) {
        this.authService.instance.setActiveAccount(data.account);
      }

      if (!data && this.authService.instance.getAllAccounts().length === 0) {
        this.router.navigate(['/login']);
      }
    });
  }
}
