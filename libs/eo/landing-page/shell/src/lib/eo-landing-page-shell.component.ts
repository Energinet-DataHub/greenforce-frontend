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
import { EoLandingPageTopLayoutScam } from './layout/eo-landing-page-top-layout.component';
import { EoLandingPageVideoLayoutScam } from './layout/eo-landing-page-video-layout.component';
import { EoLandingPageImageTextLayoutScam } from './layout/eo-landing-page-image-text-layout.component';
import { EoLandingPageLogInButtonScam } from './layout/eo-landing-page-login-button.component';
import { EoLandingPageBottomLayoutScam } from './layout/eo-landing-page-bottom.component';

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
          width: 100%; // This is used for styling 100% of the available screen width, with i.eg a background color
        }

        .${selector}__wrapper--highlighted {
          background: var(
            --watt-color-focus-selection
          ); // This is the light-blue-ish background color
        }

        .${selector}__wrapper--wave {
          height: 250px;
          background: url('/assets/landing-page/landing-page-wave.svg')
            no-repeat bottom;
          background-size: contain;
        }

        .${selector}__footer-mesh {
          width: 35%;
          position: absolute;
          bottom: 200px; // Position the image just above the footer
        }

        .${selector}__header-mesh {
          width: 35%;
          position: absolute;
          top: 64px; // Position the image just below the header
          right: 0;
        }
      }
    `,
  ],
  template: `
    <eo-landing-page-header></eo-landing-page-header>

    <img
      src="/assets/landing-page/landing-page-mesh-top.png"
      class="${selector}__header-mesh"
    />

    <eo-landing-page-top-layout></eo-landing-page-top-layout>

    <div class="${selector}__wrapper ${selector}__wrapper--wave"></div>

    <div class="${selector}__wrapper ${selector}__wrapper--highlighted">
      <eo-landing-page-video-layout></eo-landing-page-video-layout>
    </div>

    <eo-landing-page-image-text-layout></eo-landing-page-image-text-layout>

    <div class="${selector}__wrapper ${selector}__wrapper--highlighted">
      <eo-landing-page-bottom-layout></eo-landing-page-bottom-layout>
    </div>

    <img
      src="/assets/landing-page/landing-page-mesh-bottom.png"
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
    EoLandingPageTopLayoutScam,
    EoLandingPageVideoLayoutScam,
    EoLandingPageImageTextLayoutScam,
    EoLandingPageLogInButtonScam,
    EoLandingPageBottomLayoutScam,
  ],
})
export class EoLandingPageShellScam {}
