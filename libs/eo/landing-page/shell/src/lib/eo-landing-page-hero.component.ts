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
  ElementRef,
  HostListener,
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
    display: block;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100vh;
    min-height: 514px;
  }

  .video-container {
    position: relative;
    width: 100%;
    height: 100%;
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
    padding: 0 99px;
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
    gap: 24px;
  }

  #hero-heading {
    color: #fff;
    text-transform: uppercase;
    font-size: 62px;
    line-height: 67px;
    color: #fff;
    order: 2;
    margin-top: 14px;
  }

  .hero-subheading {
    font-size: 18px;
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
    border-radius: 360px;
    background: #24B492;
    color: #fff;
    border: none;
  }

  // Change the color of the primary button for screen readers to satisfy the contrast ratio
  @media screen-reader {
    button.primary {
      color: #000; // Change the color for screen readers
    }
  }

  button.secondary {
    display: inline-flex;
    padding: 16px 24px;
    align-items: center;
    gap: 8px;
    border-radius: 360px;
    border: 1px solid #24B492;
    background: transparent;
    color: #fff;
  }
  `,
  template: `
    <div class="video-container">
      <video
        #videoPlayer
        autoplay
        loop
        muted
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
export class EoLandingPageHeroComponent {
  @ViewChild('videoPlayer') videoplayer!: ElementRef;
  private videoStarted = false;
  private authService = inject(EoAuthService);

  @HostListener('mousemove')
  onMouseMove(): void {
    if (this.videoStarted) return;
    this.playVideo();
  }

  private playVideo(): void {
    if (this.videoplayer) {
      this.videoplayer.nativeElement
        .play()
        .then(() => (this.videoStarted = true))
        .catch((error: any) => {
          // Auto-play was prevented
          // Show a UI element to let the user manually start playback
        });
    }
  }

  onLogin(): void {
    this.authService.startLogin();
  }

  onLearnMore(): void {
    // Handle learn more
  }
}
