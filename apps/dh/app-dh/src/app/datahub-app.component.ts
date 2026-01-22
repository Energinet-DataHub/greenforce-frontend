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
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { TranslocoService } from '@jsverse/transloco';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhIframeService } from '@energinet-datahub/dh/shared/util-iframe';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  CookieInformationService,
  CookieInformationCulture,
} from '@energinet-datahub/gf/util-cookie-information';

const loginRoute = '/login';
const dhRedirectToParam = 'dhRedirectTo';

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
  imports: [RouterOutlet],
})
export class DataHubAppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);

  private readonly cookieInformationService = inject(CookieInformationService);
  private readonly transloco = inject(TranslocoService);
  private readonly appInsights = inject(DhApplicationInsights);
  private readonly authService = inject(MsalService);
  private readonly iframeService = inject(DhIframeService);

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
        this.appInsights.setCookiesUsage(status.cookie_cat_statistic);
      });

    this.authService.handleRedirectObservable().subscribe((data) => {
      if (data) {
        this.authService.instance.setActiveAccount(data.account);

        // After successful auth at top level, redirect to wrapper for iframe experience
        // Use replace() to avoid creating browser history entries
        if (!this.iframeService.isInIframe()) {
          globalThis.location.replace('/');
          return;
        }
      }

      const hasAccounts = this.authService.instance.getAllAccounts().length > 0;

      // When in iframe, authentication should already be validated by wrapper
      // If no accounts, request re-authentication from parent
      if (this.iframeService.isInIframe()) {
        if (!hasAccounts) {
          this.iframeService.requestAuthentication();
        }
        return;
      }

      // When at top level (not in iframe), handle login navigation
      // Needed to make sure the `dhRedirectTo` query is not set again on page refresh
      const isRedirectToSet = !!this.activatedRoute.snapshot.queryParams[dhRedirectToParam];

      if (!data && !isRedirectToSet && !hasAccounts) {
        this.router.navigate([loginRoute], {
          queryParams: { [dhRedirectToParam]: this.getRedirectTo() },
        });
      }
    });
  }

  private getRedirectTo(): string {
    const path = this.location.path();

    if (path.startsWith(loginRoute)) {
      return '/';
    }

    // Handle case where a new users is redirected to the app after sign up
    // B2C redirects back to `<app-url>?code=<code>` url
    if (path.startsWith('?code=')) {
      return '/';
    }

    return path || '/';
  }
}
