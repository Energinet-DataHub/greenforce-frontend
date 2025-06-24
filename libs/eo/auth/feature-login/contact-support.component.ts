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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';
import { WindTurbineComponent } from './wind-turbine.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-contact-support',
  standalone: true,
  imports: [RouterModule, TranslocoPipe, WindTurbineComponent, WattButtonComponent],
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
      }

      .support-block {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .support-block > * {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    `,
  ],
  template: `
    <div class="support-block">
      <h2 [innerHTML]="title() | transloco"></h2>
      <p [innerHTML]="message() | transloco"></p>
      <eo-wind-turbine [height]="300" [width]="200" [rotationSpeed]="5" />
      <watt-button (click)="authService.logout()">
        {{ translations.shared.notWhitelistedError.logout | transloco }}
      </watt-button>
    </div>
  `,
})
export class ContactSupportComponent {
  protected routes = eoRoutes;
  protected translations = translations;
  protected authService = inject(EoAuthService);

  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  // --- Signals ---
  readonly errorType = signal<string | null>(null);
  readonly orgStatus = signal<string | null>(null);

  readonly title = computed(() => {
    if (this.errorType() === 'whitelist') {
      if (this.orgStatus() === 'trial') return this.translations.shared.trialWhitelistError.title;
      if (this.orgStatus() === 'normal') return this.translations.shared.normalWhitelistError.title;
    }
    return this.translations.shared.notWhitelistedError.title;
  });

  readonly message = computed(() => {
    if (this.errorType() === 'whitelist') {
      if (this.orgStatus() === 'trial') return this.translations.shared.trialWhitelistError.message;
      if (this.orgStatus() === 'normal')
        return this.translations.shared.normalWhitelistError.message;
    }
    return this.translations.shared.notWhitelistedError.message;
  });

  constructor() {
    const navState = this.router.getCurrentNavigation()?.extras.state as
      | { errorType?: string; orgStatus?: string }
      | undefined;

    this.errorType.set(navState?.errorType ?? null);
    this.orgStatus.set(navState?.orgStatus ?? null);

    // This ensures the first render doesn't use stale translations
    this.transloco
      .selectTranslate(this.translations.shared.notWhitelistedError.title)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.detectChanges();
      });

    // Support internal navigation links
    queueMicrotask(() => {
      const links = document.querySelectorAll('eo-contact-support a[class="internal-link"]');
      links.forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.router.navigate([link.getAttribute('href')]);
        });
      });
    });
  }
}
