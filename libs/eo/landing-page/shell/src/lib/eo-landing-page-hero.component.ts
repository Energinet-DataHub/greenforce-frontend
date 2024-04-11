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
} from '@angular/core';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { EoLearnMoreComponent } from './learn-more.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconComponent, EoLearnMoreComponent],
  selector: 'eo-landing-page-hero',
  styles: `
  :host {
    container: hero / size;
    display: block;
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    min-height: 650px;

    .container {
      --headings-aligment: center;
      --heading-size: 38px;
      --actions-container-alignment: column;

      position: relative;
      width: 100%;
      height: 100%;
      padding-top: 44px; // annouce bar height
    }

    @container hero (width > 478px) and (height > 650px) {
      .container {
        --headings-aligment: left;
        --heading-size: 62px;
        --heading-line-height: normal;
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
    padding: 0 clamp(16px, 5vw, 99px);;
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
    text-transform: uppercase;
    text-align: var(--headings-aligment);
    font-size: var(--heading-size);
    line-height: normal;
    order: 2;
    margin-top: 14px;
  }

  .hero-subheading {
    font-size: 18px;
    text-align: var(--headings-aligment);
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.54px;
    text-transform: uppercase;
    color: #13ECB8;
    order: 1;
  }

  button.primary {
    display: inline-flex;
    padding: 16px 24px;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    border-radius: 360px;
    background: #24B492;
    color: #fff;
    border: none;
  }

  button.secondary {
    display: inline-flex;
    padding: 16px 24px;
    text-transform: uppercase;
    align-items: center;
    gap: 8px;
    border-radius: 360px;
    border: 1px solid #24B492;
    background: transparent;
    color: #fff;
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
          <h1 id="hero-heading" class="hero-heading">
            Trace Energy to Its Origin.<br />Truthfully.
          </h1>
          <!-- Subheading or slogan -->
          <p class="hero-subheading">Green Proof You Can Trust</p>
        </section>

        <section aria-labelledby="hero-heading" class="actions-container">
          <button class="primary" (click)="onLogin()">
            <watt-icon name="login" />
            Log in
          </button>
          <eo-learn-more>
            <button class="secondary" (click)="onLearnMore()">
              <watt-icon name="smartDisplay" />
              Learn more
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
