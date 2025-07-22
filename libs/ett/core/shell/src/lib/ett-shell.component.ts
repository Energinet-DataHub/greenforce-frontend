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
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  CookieInformationService,
  CookieInformationCulture,
} from '@energinet-datahub/gf/util-cookie-information';

import { translations } from '@energinet-datahub/ett/translations';
import { EttLanguageSwitcherComponent } from '@energinet-datahub/ett/globalization/feature-language-switcher';
import { EttFooterComponent } from '@energinet-datahub/ett/shared/components/ui-footer';
import { EttAuthService, IdleTimerService } from '@energinet-datahub/ett/auth/data-access';
import { EttHeaderComponent } from '@energinet-datahub/ett/shared/components/ui-header';

import { EttPrimaryNavigationComponent } from './ett-primary-navigation.component';
import { EttAccountMenuComponent } from './ett-account-menu';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EttFooterComponent,
    EttPrimaryNavigationComponent,
    RouterModule,
    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattShellComponent,
    WattBadgeComponent,
    WattTooltipDirective,
    TranslocoPipe,
    EttLanguageSwitcherComponent,
    EttAccountMenuComponent,
    EttHeaderComponent,
  ],
  selector: 'ett-shell',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
      }

      a {
        color: var(--watt-color-primary);
      }

      .logo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 var(--watt-space-m);
        margin-top: var(--watt-space-m);
      }

      .logo {
        width: 80%;
      }

      .badges-container {
        display: flex;
        flex-direction: row;
        gap: var(--watt-space-s);
        justify-content: center;
        margin-top: var(--watt-space-s);
        margin-bottom: var(--watt-space-m);
      }

      .content {
        padding: var(--watt-space-m);

        @include watt.media('>Small') {
          min-height: 90vh;
        }
      }
    `,
  ],
  template: `
    @if (user() && user()?.profile?.tos_accepted) {
      <watt-shell>
        <ng-container watt-shell-sidenav>
          <div class="logo-container">
            <img class="logo" src="/assets/images/energy-track-and-trace-logo-secondary.svg" />
            <div class="badges-container">
              <watt-badge
                type="version"
                [wattTooltip]="translations.topbar.beta.message | transloco"
                wattTooltipPosition="bottom-end"
                wattTooltipVariant="light"
              >
                {{ translations.topbar.beta.title | transloco }}
              </watt-badge>
              @if (user()?.profile?.org_status === 'trial') {
                <watt-badge type="version">
                  {{ translations.topbar.trial.title | transloco }}
                </watt-badge>
              }
            </div>
          </div>
          <ett-primary-navigation />
        </ng-container>

        <ng-container watt-shell-toolbar>
          <vater-stack direction="row" fill="horizontal">
            <h2>{{ titleService.getTitle() }}</h2>

            <vater-spacer />

            <ett-account-menu>
              <ett-language-switcher [changeUrl]="true">
                <watt-button variant="text" icon="language">
                  {{ translations.languageSwitcher.title | transloco }}</watt-button
                >
              </ett-language-switcher>
              <hr />
              <watt-button variant="text" (click)="onLogout()" icon="logout">{{
                translations.topbar.logout | transloco
              }}</watt-button>
            </ett-account-menu>

            <watt-button variant="text" [routerLink]="['help']" icon="help" />
          </vater-stack>
        </ng-container>

        <div class="content">
          <router-outlet />
        </div>

        <ett-footer />
      </watt-shell>
    } @else {
      <ett-header />
      <div class="content">
        <router-outlet />
      </div>
      <ett-footer />
    }
  `,
})
export class EttShellComponent implements OnInit, OnDestroy {
  protected titleService = inject(Title);
  private idleTimerService = inject(IdleTimerService);
  private authService = inject(EttAuthService);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private cookieInformationService: CookieInformationService = inject(CookieInformationService);

  protected user = this.authService.user;
  protected translations = translations;
  protected cookiesSet: string | null = null;

  constructor() {
    this.idleTimerService.startMonitor();
  }

  ngOnInit(): void {
    this.cookieInformationService.init({
      culture: this.transloco.getActiveLang() as CookieInformationCulture,
    });

    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.cookieInformationService.reInit({
        culture: lang as CookieInformationCulture,
      });
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.idleTimerService.stopMonitor();
  }

  protected isTrialUser(): boolean {
    const user = this.authService.user();
    return user?.profile?.org_status === 'trial';
  }
}
