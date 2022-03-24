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
import { EoVimeoPlayerScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

import { EoLandingPageColumnLayoutScam } from './layout/eo-landing-page-column-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-introduction',
  styles: [
    `
      // 1. Inset XXL.
      :host {
        --eo-space-xxl: calc(2 * var(--watt-space-xl)); // [1]

        display: block;

        margin: var(--eo-space-xxl); // [1]
      }

      .video-wrapper {
        max-width: 640px; // Magic number by designer
        margin: 0 auto; // Center content
      }

      // 1. Center content with max width.
      .content-wrapper {
        margin: 0 auto; // [1]
        max-width: var(--eo-landing-page-content-max-width); // [1]
      }
    `,
  ],
  template: `
    <div class="content-wrapper">
      <h2>What is Energy Origin?</h2>

      <p>
        Energy Origin is a platform which provides you with access to
        <strong>data</strong> about the
        <strong>origins of your energy</strong> and the corresponding
        <strong>emissions</strong>. This first version of Energy Origin is for
        companies in Denmark and can be used for e.g.:
      </p>

      <div class="watt-space-stack-l">
        <ul class="watt-space-inset-squish-m">
          <li>
            Compiling an <strong>emissions overview</strong> for your annual ECG
            report
          </li>
          <li>
            Gaining an overview of the <strong>renewables share</strong> of your
            energy consumption
          </li>
        </ul>
      </div>

      <div class="watt-space-stack-l">
        <a
          href="https://en.energinet.dk/Electricity/DataHub/Energy-Origin"
          target="_blank"
          >Read more about Project Energy Origin</a
        >
      </div>

      <div class="video-wrapper">
        <eo-vimeo-player
          url="https://player.vimeo.com/video/642352286?h=91e1a8b63c&badge=0&autopause=0&player_id=0&app_id=58479"
        ></eo-vimeo-player>
      </div>
    </div>
  `,
})
export class EoLandingPageIntroductionComponent {}

@NgModule({
  declarations: [EoLandingPageIntroductionComponent],
  exports: [EoLandingPageIntroductionComponent],
  imports: [EoLandingPageColumnLayoutScam, EoVimeoPlayerScam],
})
export class EoLandingPageIntroductionScam {}
