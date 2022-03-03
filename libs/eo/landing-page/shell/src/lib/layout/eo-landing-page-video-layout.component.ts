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
import {
  EoLandingPageColumnLayoutScam,
  layoutTypeEnum,
} from './eo-landing-page-column-layout.component';

const selector = 'eo-landing-page-video-layout';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        position: relative;
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

      .${selector}__development-notification {
        background: rgba(223, 235, 218, 0.9);
        top: calc(-10 * var(--watt-space-xs));
        height: calc(20 * var(--watt-space-xs));
        width: 100%;
        padding-left: calc(20 * var(--watt-space-xs));
        position: absolute;

        &::before {
          display: block;
          content: ' i ';
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--watt-color-primary-dark);
          color: #fff;
          position: absolute;
          left: 16px;
          text-align: center;
          line-height: 50px;
          font-size: 30px;
        }
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout [layoutType]="layoutTypeEnum.FULL">
      <!-- Development notification -->
      <div class="${selector}__development-notification watt-space-inset-m">
        <p class="${selector}__p">
          The Energy Origin Platform is under development and new
          functionalities will be released continuously. The first release of
          the platform offers commercial login only. Private login via NemID/MitID
          is intended to form part of one of the next releases.
        </p>
      </div>

      <div class="watt-space-inset-xl eo-padding-top-none">
        <h2 class="${selector}__h2">What is Energy Origin</h2>

        <p class="${selector}__p">
          Energy Origin is a platform which provides you with access to data
          about the origins of your energy and the corresponding
          emissions.<br /><br />
          The first release of the platform offers commercial login only.
          Private login via NemID/MitID is intended to be part of one of the
          next releases.
        </p>

        <a
          href="https://en.energinet.dk/Electricity/DataHub/Energy-Origin"
          target="_blank"
          class="${selector}__link"
        >Read more about Project Energy Origin</a
        >

        <br /><br />

        <div class="eo-video-embed-container">
          <iframe
            src="https://player.vimeo.com/video/642352286?h=91e1a8b63c&badge=0&autopause=0&player_id=0&app_id=58479"
          ></iframe>
        </div>
      </div>
    </eo-landing-page-column-layout>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageVideoLayoutComponent {
  layoutTypeEnum = layoutTypeEnum;
}

@NgModule({
  declarations: [EoLandingPageVideoLayoutComponent],
  exports: [EoLandingPageVideoLayoutComponent],
  imports: [EoLandingPageColumnLayoutScam],
})
export class EoLandingPageVideoLayoutScam {}
