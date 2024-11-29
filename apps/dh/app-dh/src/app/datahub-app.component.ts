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
