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
import { EoLandingPageColumnLayoutScam } from './eo-landing-page-column-layout.component';
import { EoVimeoPlayerScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

const selector = 'eo-landing-page-video-layout';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        margin-bottom: calc(2 * var(--watt-space-xl));
      }
      .${selector}__p {
        @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
      }
      .${selector}__h2.${selector}__h2 {
        @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
        text-transform: none; // This overrides the uppercased styling from watt
      }
      .${selector}__link.${selector}__link {
        display: inline-block;
        color: var(
          --watt-color-primary
        ); // This overrides the '--watt-color-primary-dark' color which is currently added by the watt-text-s class
      }
      .${selector}__embedded {
        width: 640px; // Figma
        margin: 0 auto;
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout [layoutType]="'full'">
      <h2 class="${selector}__h2">What is Energy Origin?</h2>

      <p class="${selector}__p">
        Energy Origin is a platform which provides you with access to
        <b>data</b> about the <b>origins of your energy</b> and the
        corresponding <b>emissions</b>. This first version of Energy Origin is
        for companies in Denmark and can be used for e.g.:
      </p>
      <ul class="watt-space-stack-l">
        <li>
          Compiling an <b>emissions overview</b> for your annual ECG report
        </li>
        <li>
          Gaining an overview of the <b>renewables share</b> of your energy
          consumption
        </li>
      </ul>

      <a
        href="https://en.energinet.dk/Electricity/DataHub/Energy-Origin"
        target="_blank"
        class="${selector}__link watt-space-stack-l"
        >Read more about Project Energy Origin</a
      >

      <div class="${selector}__embedded">
        <eo-vimeo-player
          [url]="
            'https://player.vimeo.com/video/642352286?h=91e1a8b63c&badge=0&autopause=0&player_id=0&app_id=58479'
          "
        ></eo-vimeo-player>
      </div>
    </eo-landing-page-column-layout>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageVideoLayoutComponent {}

@NgModule({
  declarations: [EoLandingPageVideoLayoutComponent],
  exports: [EoLandingPageVideoLayoutComponent],
  imports: [EoLandingPageColumnLayoutScam, EoVimeoPlayerScam],
})
export class EoLandingPageVideoLayoutScam {}
