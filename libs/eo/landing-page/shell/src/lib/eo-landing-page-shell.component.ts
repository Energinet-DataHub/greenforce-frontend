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
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';

import { EoLandingPageCallToActionScam } from './eo-landing-page-call-to-action.component';
import { EoLandingPageHeaderScam } from './eo-landing-page-header.component';
import { EoLandingPageHeroScam } from './eo-landing-page-hero.component';
import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';
import { EoLandingPageNotificationScam } from './eo-landing-page-notification.component';
import { EoLandingPageStore } from './eo-landing-page.store';
import { EoLandingPageImageTextLayoutScam } from './layout/eo-landing-page-image-text-layout.component';
import { EoLandingPageVideoLayoutScam } from './layout/eo-landing-page-video-layout.component';

@Component({
  providers: [EoLandingPageStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-shell',
  styles: [
    `
      :host {
        display: block;
      }

      img {
        display: block;
      }

      .positioning-context {
        position: relative;
      }

      .snap-bottom {
        position: absolute;
        bottom: 0;
      }

      .collapse-bottom {
        padding-bottom: 0 !important;
      }
    `,
  ],
  template: `
    <eo-landing-page-header></eo-landing-page-header>

    <div class="positioning-context">
      <eo-landing-page-notification
        class="collapse-bottom"
      ></eo-landing-page-notification>
      <eo-landing-page-hero></eo-landing-page-hero>
      <eo-landing-page-video-layout></eo-landing-page-video-layout>
      <eo-landing-page-image-text-layout></eo-landing-page-image-text-layout>
      <eo-landing-page-call-to-action></eo-landing-page-call-to-action>

      <div class="snap-bottom">
        <img src="/assets/images/landing-page/landing-page-mesh-bottom.png" />
      </div>
    </div>

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
    EoLandingPageNotificationScam,
  ],
})
export class EoLandingPageShellScam {}
