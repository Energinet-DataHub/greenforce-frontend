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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { EoAuthService } from '@energinet-datahub/eo/shared/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconComponent],
  selector: 'eo-landing-page-cta',
  styles: `
    :host {
      display: block;
      width: 100%;
      padding: 96px 32px;
      background: #fff;
      display: grid;
      grid-template-areas:
        "heading"
        "login"
        "devportal";
      gap: 64px;

      @media (min-width: 895px) {
        padding: 212px 14vw;
        grid-template-areas:
          "heading heading . ."
          "login devportal . .";
        gap: 58px;
      }
    }

    .heading-1 {
      color: rgba(0, 0, 0, 0.87);
      font-size: 38px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-transform: uppercase;

      @media (min-width: 895px) {
        font-size: 62px;
      }
    }

    .heading-3 {
      color: rgba(0, 0, 0, 0.87);
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: 34px;

      @media (min-width: 895px) {
        font-size: 28px;
      }
    }

    h2 {
      max-width: 680px;
      grid-area: heading;
    }

    h3 {
      margin-bottom: 30px;
    }

    .login {
      grid-area: login;
    }

    .devportal {
      grid-area: devportal;
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

    button {
      &:hover, &:focus-visible {
        background: #EE9331;
        border-color: #EE9331;
        outline: none;
      }
    }
  `,
  template: `
    <h2 class="heading-1">Ready to track your company’s energy?</h2>
    <section class="login">
      <h3 class="heading-3">Try it out. Energy Origin Beta.</h3>
      <button class="primary" (click)="onLogin()">
        <watt-icon name="login" />
        Log in
      </button>
    </section>
    <section class="devportal">
      <h3 class="heading-3">Collaboration. Interested in our APIs?</h3>
      <button class="primary" (click)="openDeveloperPortal()">
        <watt-icon name="openInNew" />
        check it out
      </button>
    </section>
  `,
})
export class EoLandingPageCTAComponent {
  private authService = inject(EoAuthService);

  onLogin(): void {
    this.authService.startLogin();
  }

  openDeveloperPortal(): void {
    alert('Not implemented yet.');
  }
}
