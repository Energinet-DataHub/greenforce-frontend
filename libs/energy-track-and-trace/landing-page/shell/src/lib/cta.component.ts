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
import { EttAuthService } from '@energinet-datahub/ett/shared/services';
import { EttApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { translations } from '@energinet-datahub/ett/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconComponent, TranslocoPipe],
  selector: 'ett-landing-page-cta',
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

    .headline-1 {
      color: rgba(0, 0, 0, 0.87);
    }

    .headline-3 {
      color: rgba(0, 0, 0, 0.87);
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

    section {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
    }
  `,
  template: `
    <h2 class="headline-1">{{ translations.landingPage.cta.heading | transloco }}</h2>
    <section class="login">
      <h3 class="headline-3">{{ translations.landingPage.cta.section1.heading | transloco }}</h3>
      <button class="button primary" (click)="onLogin()">
        <watt-icon name="login" />
        {{ translations.landingPage.cta.section1.cta | transloco }}
      </button>
    </section>
    <section class="devportal">
      <h3 class="headline-3">{{ translations.landingPage.cta.section2.heading | transloco }}</h3>
      <a [href]="devPortalHref" target="_blank" class="button primary"
        ><watt-icon name="openInNew" />{{
          translations.landingPage.cta.section2.cta | transloco
        }}</a
      >
    </section>
  `,
})
export class EttLandingPageCTAComponent {
  private authService = inject(EttAuthService);

  protected devPortalHref: string = inject(EttApiEnvironmentToken).developerPortal;
  protected translations = translations;

  onLogin(): void {
    this.authService.startLogin();
  }
}
