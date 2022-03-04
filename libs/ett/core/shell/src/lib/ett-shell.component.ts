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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoProductLogoScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EttPrimaryNavigationScam } from './ett-primary-navigation.component';
import { RouterModule } from '@angular/router';
import { WattShellModule } from '@energinet-datahub/watt';

const selector = 'ett-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;

        watt-shell mat-sidenav.mat-drawer {
          color: var(--watt-color-primary-dark-contrast);
        }

        watt-shell .watt-toolbar watt-icon-button[icon='menu'] > button {
          // Remove menu toggle left padding to collapse with top app bar padding
          padding-left: 0;
        }

        .watt-main-content {
          min-height: calc(
            100% - 48px
          ); // 48px is = available screen height minus the top bar
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

        // This is the feature page/component
        // The padding on this element has been copied from: libs/ui-watt/src/lib/components/shell/shell.component.scss
        .watt-main-content > :nth-child(2) {
          @include watt.space-inset-m;

          @include watt.media('>Large') {
            @include watt.space-inset-l;
          }
        }

        .${selector}__logo {
          height: calc(8 * var(--watt-space-xs));
        }

        .${selector}__link {
          display: block;
          color: var(
            --watt-color-primary
          ); // This overrides the '--watt-color-primary-dark' color which is currently added by the watt-text-s class
        }
      }
    `,
  ],
  template: `
    <watt-shell>
      <ng-container watt-shell-sidenav>
        <ett-primary-navigation></ett-primary-navigation>
      </ng-container>

      <ng-container watt-shell-toolbar>
        <img class="${selector}__logo" eoProductLogo />
      </ng-container>

      <router-outlet></router-outlet>

      <eo-footer>
        <a
          routerLink="/privacy-policy"
          class="${selector}__link watt-space-stack-m watt-text-s"
          aria-label="Privacy policy"
          >Privacy policy
        </a>
      </eo-footer>
    </watt-shell>
  `,
})
export class EttShellComponent {}

@NgModule({
  declarations: [EttShellComponent],
  imports: [
    RouterModule,
    WattShellModule,
    EttPrimaryNavigationScam,
    EoProductLogoScam,
    EoFooterScam,
  ],
})
export class EttShellScam {}
