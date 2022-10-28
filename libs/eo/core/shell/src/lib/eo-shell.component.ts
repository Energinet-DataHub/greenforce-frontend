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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EoCookieBannerComponentScam } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoProductLogoScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoTitleStore } from '@energinet-datahub/eo/shared/util-browser';
import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { PushModule } from '@rx-angular/template';
import { Observable } from 'rxjs';
import { EoPrimaryNavigationScam } from './eo-primary-navigation.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

      ::ng-deep
        watt-shell
        .watt-toolbar
        watt-icon-button[icon='menu']
        > button {
        // Remove menu toggle left padding to collapse with top app bar padding
        padding-left: 0;
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

        /**
         * We have 3 items in the content area:
         * 1) The Angular router-outlet
         * 2) The page/component being rendered below the router outlet
         * 3) The footer
         *
         * Display grid considers the above 3 elements, when positioning them on the screen
         * This allows us to set the router outlet height = 0, the page content to what ever height it might have, the footer to the height it has
        */
        display: grid;
        grid-template-rows: 0 1fr auto;
      }

      // This is the feature/page component
      ::ng-deep .watt-main-content.watt-main-content > :nth-child(2) {
        padding: var(--watt-space-l);

        @include watt.media('<Large') {
          padding: var(--watt-space-m);
        }
      }
    `,
  ],
  template: `
    <eo-cookie-banner
      *ngIf="!cookiesSet"
      (accepted)="getBannerStatus()"
    ></eo-cookie-banner>
    <watt-shell>
      <ng-container watt-shell-sidenav>
        <div class="logo-container">
          <img
            class="logo"
            src="/assets/images/energy-origin-logo-secondary.svg"
          />
        </div>
        <eo-primary-navigation></eo-primary-navigation>
      </ng-container>

      <ng-container watt-shell-toolbar>
        <h2>{{ title$ | push }}</h2>
      </ng-container>

      <router-outlet></router-outlet>

      <eo-footer></eo-footer>
    </watt-shell>
  `,
})
export class EoShellComponent {
  title$: Observable<string> = this.title.routeTitle$;
  cookiesSet: string | null = null;

  constructor(private title: EoTitleStore) {
    this.getBannerStatus();
  }

  getBannerStatus() {
    this.cookiesSet = localStorage.getItem('cookiesAccepted');
  }
}

@NgModule({
  declarations: [EoShellComponent],
  imports: [
    RouterModule,
    WattShellComponent,
    EoPrimaryNavigationScam,
    EoCookieBannerComponentScam,
    EoProductLogoScam,
    EoFooterScam,
    PushModule,
    CommonModule,
  ],
})
export class EoShellScam {}
