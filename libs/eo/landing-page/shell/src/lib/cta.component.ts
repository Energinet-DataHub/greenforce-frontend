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
import { TranslocoPipe } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconComponent, TranslocoPipe],
  selector: 'eo-landing-page-cta',
  styles: `
    :host {
      display: block;
      width: 100%;
      padding: 48px 32px;
      background: #fff;
      display: grid;
      grid-template-areas:
        'heading'
        'login'
        'devportal';
      gap: 64px;

      @media (min-width: 895px) {
        padding: 212px 14vw;
        grid-template-areas:
          'heading heading . .'
          'login devportal . .';
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

    button.primary,
    .button.primary {
      display: inline-flex;
      padding: 16px 24px;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      border-radius: 360px;
      background: #24b492;
      color: #fff;
      border: none;
    }

    .button {
      text-decoration: none;
    }

    button,
    .button {
      &:hover,
      &:focus-visible {
        background: #ee9331;
        border-color: #ee9331;
        outline: none;
      }
    }
  `,
  template: `
    <h2 class="heading-1">{{ translations.landingPage.cta.heading | transloco }}</h2>
    <section class="login">
      <h3 class="heading-3">{{ translations.landingPage.cta.section1.heading | transloco }}</h3>
      <button class="primary" (click)="onLogin()">
        <watt-icon name="login" />
        {{ translations.landingPage.cta.section1.cta | transloco }}
      </button>
    </section>
    <section class="devportal">
      <h3 class="heading-3">{{ translations.landingPage.cta.section2.heading | transloco }}</h3>
      <a [href]="devPortalHref" target="_blank" class="button primary"
        ><watt-icon name="openInNew" />{{ translations.landingPage.cta.section2.cta | transloco }}</a
      >
    </section>
  `,
})
export class EoLandingPageCTAComponent {
  private authService = inject(EoAuthService);

  protected devPortalHref: string = inject(eoApiEnvironmentToken).developerPortal;
  protected translations = translations;

  onLogin(): void {
    this.authService.startLogin();
  }
}
