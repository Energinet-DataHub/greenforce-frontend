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
import { TranslocoPipe } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/ett/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoPipe],
  selector: 'ett-landing-page-granular-certificates',
  styles: `
    :host {
      background: #f9f9f9;
      padding: 48px 24px 0 24px;
      display: flex;
      justify-content: center;

      @media (min-width: 960px) {
        padding-top: 185px;
      }
    }

    section {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(2, auto);
      grid-template-areas:
        'image'
        'content';
      place-items: center;
      gap: 34px;

      @media (min-width: 960px) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
        grid-template-areas: 'content image';
        gap: 75px;
        max-width: 1000px;
      }
    }

    picture {
      grid-area: image;
    }

    .content {
      display: flex;
      grid-area: content;
      flex-direction: column;
      justify-content: center;
    }

    h3,
    p {
      color: rgba(0, 0, 0, 0.87);
    }

    h3 {
      margin-bottom: 30px;
    }
  `,
  template: `
    <section>
      <div class="content">
        <h3 class="headline-3">
          {{ translations.landingPage.granularCertificates.heading | transloco }}
        </h3>
        <p>{{ translations.landingPage.granularCertificates.content | transloco }}</p>
      </div>

      <picture aria-hidden>
        <source
          srcset="
            /assets/landing-page/granular-certificates/granular-certificates.avif    1x,
            /assets/landing-page/granular-certificates/granular-certificates@2x.avif 2x,
            /assets/landing-page/granular-certificates/granular-certificates@3x.avif 3x
          "
          type="image/avif"
        />
        <img src="/assets/landing-page/granular-certificates/granular-certificates.avif" />
      </picture>
    </section>
  `,
})
export class EttLandingPageGranularCertificatesComponent {
  protected translations = translations;
}
