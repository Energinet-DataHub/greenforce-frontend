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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { eoPrivacyPolicyRoutePath } from '@energinet-datahub/eo/privacy-policy/routing';
import { EoProductLogoScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoTitleStore } from '@energinet-datahub/eo/shared/util-browser';
import { WattShellModule } from '@energinet-datahub/watt';
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

      // 1. Increase specificity.
      // 2. Align with main content.
      ::ng-deep .watt-toolbar.watt-toolbar/* [1] */ {
        @include watt.space-inset-squish-l; // [2]
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
        @include watt.space-inset-l;
      }
    `,
  ],
  template: `
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

      <eo-footer>
        <p>
          <a routerLink="/${eoPrivacyPolicyRoutePath}" class="watt-text-s"
            >Privacy Policy</a
          >
        </p>
      </eo-footer>
    </watt-shell>
  `,
})
export class EoShellComponent {
  title$: Observable<string> = this.title.routeTitle$;

  constructor(private title: EoTitleStore) {}
}

@NgModule({
  declarations: [EoShellComponent],
  imports: [
    RouterModule,
    WattShellModule,
    EoPrimaryNavigationScam,
    EoProductLogoScam,
    EoFooterScam,
    PushModule,
  ],
})
export class EoShellScam {}
