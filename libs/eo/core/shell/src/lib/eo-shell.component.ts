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
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { RouterModule } from '@angular/router';
import { EoCookieBannerComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoFooterComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { IdleTimerService } from '@energinet-datahub/eo/shared/services';
import { EoTitleStore } from '@energinet-datahub/eo/shared/utilities';
import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { RxPush } from '@rx-angular/template/push';
import { Observable } from 'rxjs';
import { EoPrimaryNavigationComponent } from './eo-primary-navigation.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    WattShellComponent,
    MatDateFnsModule,
    EoPrimaryNavigationComponent,
    EoCookieBannerComponent,
    EoProductLogoDirective,
    EoFooterComponent,
    RxPush,
    NgIf,
  ],
  selector: 'eo-shell',
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
        height: var(--watt-space-xl);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logo {
        height: calc(6.5 * var(--watt-space-xs));
        width: calc(52 * var(--watt-space-xs));
      }

      ::ng-deep watt-shell mat-sidenav.mat-drawer {
        color: var(--watt-color-primary-dark-contrast);
      }

      ::ng-deep watt-shell .watt-toolbar watt-icon-button[icon='menu'] > button {
        padding-left: 0; // Remove menu toggle left padding to collapse with top app bar padding
      }

      ::ng-deep watt-shell .mat-nav-list {
        padding-top: 0;
      }

      ::ng-deep watt-shell .watt-toolbar.watt-toolbar {
        height: var(--watt-space-xl);
        @include watt.space-inset-squish-l;

        @include watt.media('<Large') {
          padding: 0;
        }
      }

      ::ng-deep .watt-main-content {
        --top-app-bar-height: var(--watt-space-xl);
        min-height: calc(100% - var(--top-app-bar-height));
        padding: 0 !important; // We remove the padding, so we can stretch the footer out in full width
        display: grid;
        grid-template-rows: 1fr auto;
      }

      .content {
        padding: var(--watt-space-m);

        @include watt.media('>=Large') {
          padding: var(--watt-space-l);
        }
      }
    `,
  ],
  template: `
    <eo-cookie-banner *ngIf="!cookiesSet" (accepted)="getBannerStatus()" />
    <watt-shell>
      <ng-container watt-shell-sidenav>
        <div class="logo-container">
          <img class="logo" src="/assets/images/energy-origin-logo-secondary.svg" />
        </div>
        <eo-primary-navigation />
      </ng-container>

      <ng-container watt-shell-toolbar>
        <h2>{{ title$ | push }}</h2>
      </ng-container>

      <div class="content">
        <router-outlet />
      </div>

      <eo-footer />
    </watt-shell>
  `,
})
export class EoShellComponent implements OnDestroy {
  private titleStore = inject(EoTitleStore);
  private idleTimerService = inject(IdleTimerService);
  title$: Observable<string> = this.titleStore.routeTitle$;
  cookiesSet: string | null = null;

  constructor() {
    this.idleTimerService.startMonitor();
    this.getBannerStatus();
  }

  getBannerStatus() {
    this.cookiesSet = localStorage.getItem('cookiesAccepted');
  }

  ngOnDestroy() {
    this.idleTimerService.stopMonitor();
  }
}
