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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EoVimeoPlayerComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoVimeoPlayerComponent],
  selector: 'eo-landing-page-introduction',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      @use '@energinet-datahub/eo/shared/styles/spacing' as eo-spacing;

      :host {
        padding-top: var(--eo-space-xxl);
        max-width: 960px; // Magic UX number
        display: block;
        margin: 0 auto;

        @include watt.media('<Large') {
          max-width: 100%;
          padding-top: var(--watt-space-l);
        }
      }

      .video-wrapper {
        max-width: 640px; // Magic UX number
        margin: 0 auto;

        @include watt.media('<Large') {
          max-width: 100%;
        }
      }

      .content-wrapper {
        margin: 0 auto;
        padding: 0 var(--watt-space-m);
      }

      .text-list {
        padding: var(--watt-space-m) 0 var(--watt-space-l) var(--watt-space-m);
        @include watt.media('<Large') {
          padding: var(--watt-space-m) 0 var(--watt-space-m) var(--watt-space-m);
        }
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

      <ul class="text-list">
        <li>
          Compiling an <strong>emissions overview</strong> for your annual ECG
          report
        </li>
        <li>
          Gaining an overview of the <strong>renewables share</strong> of your
          energy consumption
        </li>
      </ul>

      <div class="watt-space-stack-l">
        <a
          href="https://en.energinet.dk/Energy-data/DataHub/Energy-Origin"
          target="_blank"
          rel="noopener noreferrer"
          >Read more about Project Energy Origin</a
        >
      </div>

      <div class="video-wrapper">
        <eo-vimeo-player
          poster="assets/images/vimeo-video-poster.png"
          video="https://player.vimeo.com/video/642352286?h=91e1a8b63c&badge=0&autopause=0&player_id=0&app_id=58479"
        ></eo-vimeo-player>
      </div>
    </div>
  `,
})
export class EoLandingPageIntroductionComponent {}
