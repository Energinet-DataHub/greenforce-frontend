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
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';

import { EoLearnMoreComponent } from './learn-more.component';
import { EoLoginButtonComponent } from './login-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconComponent, EoLearnMoreComponent, TranslocoPipe, EoLoginButtonComponent],
  selector: 'eo-landing-page-hero',
  styles: `
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      height: 100vh;
      min-height: 650px;

      .container {
        --headings-aligment: center;
        --actions-container-alignment: column;

        position: relative;
        container-type: size;

        width: 100%;
        height: 100%;
        padding-top: 44px; // annouce bar height

        @media (min-width: 478px) and (min-height: 650px) {
          --headings-aligment: left;
          --actions-container-alignment: row;
        }
      }
    }

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.4);
    }

    .content {
      padding: 0 clamp(16px, 5vw, 99px);
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .heading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .actions-container {
      margin-top: 40px;
      display: flex;
      align-items: center;
      flex-direction: var(--actions-container-alignment);
      gap: 24px;
    }

    #hero-heading {
      color: #fff;
      text-align: var(--headings-aligment);
      order: 2;
      margin-top: 14px;
    }

    .hero-subheading {
      text-align: var(--headings-aligment);
      color: #13ecb8;
      order: 1;
    }
  `,
  template: `
    <div class="container">
      <video
        #videoPlayer
        autoplay
        loop
        muted
        playsinline
        class="video-filter"
        poster="/assets/landing-page/blockchain-concept-cover.png"
        aria-hidden="true"
      >
        <source src="/assets/landing-page/blockchain-concept.mp4" type="video/mp4" />
      </video>

      <div class="content">
        <section aria-labelledby="hero-heading" class="heading-container">
          <!-- Main heading of the hero component -->
          <h1
            id="hero-heading"
            class="hero-heading headline-1"
            [innerHTML]="translations.landingPage.hero.heading | transloco"
          ></h1>
          <!-- Subheading or slogan -->
          <p class="hero-subheading headline-4">
            {{ translations.landingPage.hero.subheading | transloco }}
          </p>
        </section>

        <section aria-labelledby="hero-heading" class="actions-container">
          <eo-login-button />
          <eo-learn-more>
            <button class="button secondary">
              <watt-icon name="smartDisplay" />
              {{ translations.landingPage.hero.learnMoreButton | transloco }}
            </button>
          </eo-learn-more>
        </section>
      </div>
    </div>
  `,
})
export class EoLandingPageHeroComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoplayer!: ElementRef;

  private authService = inject(EoAuthService);

  protected translations = translations;
  protected isSticky = signal<boolean>(false);

  ngAfterViewInit(): void {
    if (this.videoplayer) {
      // HACK: Even though the video is muted, the browser may still block autoplay
      this.videoplayer.nativeElement.muted = true;
    }
  }

  onLogin(): void {
    this.authService.login();
  }
}
