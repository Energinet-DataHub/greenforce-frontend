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
import { MatButtonModule } from '@angular/material/button';
import { LetModule } from '@rx-angular/template';
import { EoLandingPageHeaderScam } from './eo-landing-page-header.component';
import { EoFooterScam } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoLandingPageStore } from './eo-landing-page.store';
import { Observable } from 'rxjs';

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
        position: relative;
        display: block;

        .${selector}__wrapper {
          position: relative;
          width: 100%; // This is used for styling 100% of the available screen width, with i.eg a background color
          &.wave {
            height: 250px;
            background: url('/assets/landing-page-wave.svg') no-repeat bottom;
            background-size: contain;
          }
        }

        .${selector}__wrapper--highlighted {
          background: var(
            --watt-color-focus-selection
          ); // This is the light-blue-ish background color
        }

        .${selector}__display-flex {
          display: flex;
          align-items: center;
        }

        .${selector}__content {
          // This is the rows which contain either on or two columns
          position: relative;
          width: 100%;
          max-width: 1280px; // Defined in Figma
          margin: 0 auto;

          &.space-xl {
            padding-top: calc(2 * var(--watt-space-xl));
            padding-bottom: calc(2 * var(--watt-space-xl));
          }
        }
        .${selector}__content--centered {
          text-align: center;
        }
        .${selector}__one-column {
          width: calc(100% - 200px);
          margin: 0 auto;
        }
        .${selector}__column--large {
          width: 60%;
          display: inline-block;
        }
        .${selector}__column--small {
          width: 40%;
          display: inline-block;
        }

        .${selector}__link {
          display: inline-block;
          color: var(
            --watt-color-primary
          ); // This overrides the '--watt-color-primary-dark' color which is currently added by the watt-text-s class
        }

        // 1. Primary Watt Button.
        // 2. Normal size Watt Button.
        // 3. Custom size for Watt Button in App bar.
        // 4. Align text vertically.
        .${selector}__login-link {
          @include watt.typography-watt-button; // [1]

          --height: calc(10 * var(--watt-space-xs));
          --inset-squish-m--x: var(--watt-space-m);
          --inset-squish-m--y: var(--watt-space-s);

          background: var(--watt-color-primary); // [1]
          color: var(--watt-color-primary-contrast); // [1]

          min-width: 6.25rem; // [2]
          height: var(--height); // [3]
          padding: var(--inset-squish-m--y) var(--inset-squish-m--x); // [3]

          line-height: calc(
            var(--height) - 2 * var(--inset-squish-m--y)
          ); // [3] [4]

          &:hover {
            text-decoration: none; // [1]
          }
        }

        .font-primary-color {
          color: var(--watt-color-primary);
        }

        .${selector}__p {
          @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
        }

        .${selector}__h1 {
          @include watt.typography-watt-headline-1; // This overrides the styles applied from Angular Material on h1 tags
        }

        .${selector}__h2 {
          @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
          text-transform: none; // This overrides the uppercased styling from watt
        }

        .${selector}__img {
          width: 100%;
          height: auto;
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

        .${selector}__development-notification {
          background: rgba(223, 235, 218, 0.9);
          top: -40px;
          width: 100%;
          height: 80px;
          position: absolute;

          > p {
            margin-left: 75px;
          }

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
      }
    `,
  ],
  template: `
    <eo-landing-page-header></eo-landing-page-header>

    <img
      src="/assets/landing-page-mesh-top.png"
      class="${selector}__header-mesh"
    />

    <div class="${selector}__wrapper">
      <div
        class="${selector}__content ${selector}__display-flex eo-padding-top-xl eo-padding-bottom-xl"
      >
        <div class="${selector}__column--large">
          <h1 class="${selector}__h1">
            Access
            <span class="font-primary-color"
              >your emissions and<br />energy origin</span
            >
            overview
          </h1>
          <div style="height: 403px; background: #CCC;">
            <!-- -- Placeholder for Image -- -->
          </div>
        </div>
        <div
          class="${selector}__column--small ${selector}__content--centered watt-space-inset-l"
        >
          <h2 class="${selector}__h2">Login with your business NemID</h2>
          <a
            aria-labelledby="Start"
            class="${selector}__login-link"
            mat-button
            mat-flat-button
            *rxLet="loginUrl$ as loginUrl"
            [href]="loginUrl"
            >Start</a
          >
        </div>
      </div>
    </div>

    <div class="${selector}__wrapper wave"></div>

    <div class="${selector}__wrapper ${selector}__wrapper--highlighted">
      <div class="${selector}__content">
        <!-- Development notification -->
        <div class="${selector}__development-notification watt-space-inset-m">
          <p class="${selector}__p">
            The Energy Origin Platform is under development and new
            functionalities will be released continuously. The first release of
            the platform offers business login only. Private login via
            NemID/MitID is intended to form part of one of the next releases.
          </p>
        </div>

        <div class="${selector}__one-column">
          <div class="watt-space-inset-xl">
            <h2 class="${selector}__h2">What is energy origin</h2>
            <p class="${selector}__p">
              Energy Origin is a platform which provides you with access to data
              about the origins of your energy and the corresponding
              emissions.<br /><br />
              The first release of the platform offers business login only.
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
                src="https://player.vimeo.com/video/642352286?h=91e1a8b63c"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="${selector}__content ${selector}__display-flex space-xl">
      <div
        class="${selector}__column--small watt-space-inset-l eo-padding-left-none"
      >
        <h2 class="${selector}__h2">View the origin of your energy</h2>
        <p class="${selector}__p">
          Imagine if we all knew, where our energy came from, at all times, and
          were able to choose the green energy by the hour. That is the vision,
          we are working for with the platform Energy Origin. <br /><br />
          Simultaneity between production of sustainable energy and consumption
          of energy will be a real factor in the green transition and therefore
          has great potential for future green solutions.
        </p>
      </div>
      <div class="${selector}__column--large">
        <img
          class="${selector}__img"
          src="/assets/graph-of-energy-with-dashboard.png"
          alt="EnergyOrigin graph of energy"
        />
      </div>
    </div>

    <div class="${selector}__content ${selector}__display-flex">
      <div class="${selector}__column--large">
        <img
          class="${selector}__img"
          src="/assets/landing-page-office-people.jpg"
          alt="EnergyOrigin"
        />
      </div>
      <div class="${selector}__column--small watt-space-inset-l">
        <h2 class="${selector}__h2">Who is it for</h2>
        <p class="${selector}__p">
          This first version of Energy Origin is for companies in Denmark and
          can be used for e.g.:
        </p>
        <ul>
          <li>Compiling an emissions overview for your annual ECG report</li>
          <li>
            Gaining an overview of the renewables share of your energy
            consumption
          </li>
        </ul>
      </div>
    </div>

    <div class="${selector}__content ${selector}__display-flex space-xl">
      <div
        class="${selector}__column--small watt-space-inset-l eo-padding-left-none"
      >
        <h2 class="${selector}__h2">Who are we</h2>
        <p class="${selector}__p">
          Energinet is an independent public enterprise owned by the Danish
          Ministry of Climate and Energy. We own, operate and develop the
          transmission systems for electricity and natural gas in Denmark.
        </p>
      </div>
      <div class="${selector}__column--large">
        <img
          class="${selector}__img"
          src="/assets/landing-page-energy-origin-energi-huset.jpg"
          alt="EnergyOrigin - Energihuset"
        />
      </div>
    </div>

    <div class="${selector}__wrapper ${selector}__wrapper--highlighted">
      <div class="${selector}__content watt-space-inset-xl eo-text-center">
        <h2 class="${selector}__h2">Login with your business NemId</h2>
        <a
          aria-labelledby="Start"
          class="${selector}__login-link"
          mat-button
          mat-flat-button
          *rxLet="loginUrl$ as loginUrl"
          [href]="loginUrl"
          >Start</a
        >
      </div>
    </div>

    <img
      src="/assets/landing-page-mesh-bottom.png"
      class="${selector}__footer-mesh"
    />

    <eo-footer></eo-footer>
  `,
})
export class EoLandingPageShellComponent {
  loginUrl$: Observable<string> = this.landingPageStore.authenticationUrl$;
  constructor(private landingPageStore: EoLandingPageStore) {}
}

@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [MatButtonModule, LetModule, EoLandingPageHeaderScam, EoFooterScam],
})
export class EoLandingPageShellScam {}
