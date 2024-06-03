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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { TranslocoPipe } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/eo/translations';

const selector = 'ett-landing-page-electrical-grid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  selector: 'ett-landing-page-electrical-grid',
  styles: `
    ${selector} {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      background: #f9f9f9;

      > * {
        max-width: 1169px;
      }

      video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .container {
        position: relative;
        width: 100%;
        min-height: 523px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        @media (min-width: 1170px) {
          border-radius: 32px;
          min-height: 730px;
          justify-content: flex-end;
          padding-bottom: 60px;
          padding-left: 75px;
        }

        @media screen and (orientation: landscape) and (max-width: 960px) {
          min-height: 100vh;
        }
      }

      .container::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%);

        @media (min-width: 1170px) {
          background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%);
        }
      }

      h2,
      h3 {
        text-align: center;
        z-index: 2;
      }

      h2,
      .highlight {
        color: #13ecb8;
      }

      h2 {
        color: #13ecb8;
        text-align: center;

        @media (min-width: 1170px) {
          width: 100%;
          text-align: left;
          color: #02525e;
          margin: 160px 0 30px 96px;
        }
      }

      h3 {
        margin-top: 26px;
        width: 100%;
        color: #fff;
        max-width: 391px;

        @media (min-width: 1170px) {
          text-align: left;
          max-width: 100%;
        }
      }

      .large-only {
        display: none;
        @media (min-width: 1170px) {
          display: block;
        }
      }

      .small-only {
        display: block;
        @media (min-width: 1170px) {
          display: none;
        }
      }
    }
  `,
  template: `
    <h2 class="large-only headline-4">
      {{ translations.landingPage.electricalGrid.heading | transloco }}
    </h2>
    <div class="container">
      <video
        #videoPlayer
        autoplay
        loop
        muted
        playsinline
        class="vidett-filter"
        poster="/assets/landing-page/electrical-grid-poster.png"
        aria-hidden="true"
      >
        <source src="/assets/landing-page/electrical-grid.mp4" type="video/mp4" />
      </video>
      <h2 class="small-only headline-4">
        {{ translations.landingPage.electricalGrid.heading | transloco }}
      </h2>
      <h3
        class="headline-1"
        [innerHTML]="translations.landingPage.electricalGrid.subheading | transloco"
      ></h3>
    </div>
  `,
})
export class EoLandingPageElectricalGridComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  private authService = inject(EoAuthService);

  protected translations = translations;

  ngAfterViewInit(): void {
    if (this.videoplayer) {
      // HACK: Even though the video is muted, the browser may still block autoplay
      this.videoplayer.nativeElement.muted = true;
    }
  }

  onLogin(): void {
    this.authService.startLogin();
  }

  onLearnMore(): void {
    // Handle learn more
  }
}
