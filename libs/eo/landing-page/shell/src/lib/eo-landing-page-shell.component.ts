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
import { EoLandingPageHeaderScam } from './eo-landing-page-header.component';
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoLandingPageStore } from './eo-landing-page.store';
import { EoLandingPageHeroScam } from './layout/eo-landing-page-hero.component';
import { EoLandingPageVideoLayoutScam } from './layout/eo-landing-page-video-layout.component';
import { EoLandingPageImageTextLayoutScam } from './layout/eo-landing-page-image-text-layout.component';
import { EoLandingPageLoginButtonScam } from './layout/eo-landing-page-login-button.component';
import { EoLandingPageCallToActionScam } from './layout/eo-landing-page-call-to-action.component';
import {
  EoLandingPageNotificationComponent,
  EoLandingPageNotificationScam
} from './layout/eo-landing-page-notification.component';

const selector = 'eo-landing-page-shell';

@Component({
  providers: [EoLandingPageStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        position: relative; // So we can use position absolute for the mesh illustrations at the top and bottom of the page
        display: block;

        .${selector}__wrapper {
          position: relative;
        }

        .${selector}__wrapper--highlighted {
          background: var(
            --watt-color-focus-selection
          ); // This is the light-blue-ish background color
        }

        .${selector}__wrapper--wave {
          height: 250px;
          background: url('/assets/images/landing-page/landing-page-wave.svg')
            no-repeat bottom;
          background-size: contain;
        }

        .${selector}__footer-mesh {
          width: 35%;
          position: absolute;
          bottom: 200px; // Position the image just above the footer
        }
      }
    `,
  ],
  template: `
    <eo-landing-page-header></eo-landing-page-header>

    <eo-landing-page-notification></eo-landing-page-notification>

    <eo-landing-page-hero></eo-landing-page-hero>

    <div class="${selector}__wrapper ${selector}__wrapper--wave"></div>

    <div class="${selector}__wrapper ${selector}__wrapper--highlighted">
      <eo-landing-page-video-layout></eo-landing-page-video-layout>
    </div>

    <eo-landing-page-image-text-layout></eo-landing-page-image-text-layout>

    <div class="${selector}__wrapper ${selector}__wrapper--highlighted">
      <eo-landing-page-call-to-action></eo-landing-page-call-to-action>
    </div>

    <img
      src="/assets/images/landing-page/landing-page-mesh-bottom.png"
      class="${selector}__footer-mesh"
    />

    <eo-footer></eo-footer>
  `,
})
export class EoLandingPageShellComponent {}

@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [
    EoLandingPageHeaderScam,
    EoFooterScam,
    EoLandingPageHeroScam,
    EoLandingPageVideoLayoutScam,
    EoLandingPageImageTextLayoutScam,
    EoLandingPageLoginButtonScam,
    EoLandingPageCallToActionScam,
    EoLandingPageNotificationScam
  ],
})
export class EoLandingPageShellScam {}
