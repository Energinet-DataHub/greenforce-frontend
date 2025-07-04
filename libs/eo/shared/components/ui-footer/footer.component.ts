//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/components/ui-product-logo';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { translations } from '@energinet-datahub/eo/translations';

const selector = 'eo-footer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EoProductLogoDirective, TranslocoPipe, WattBadgeComponent],
  selector,
  encapsulation: ViewEncapsulation.None,
  styles: `
    ${selector} {
      display: block;
      width: 100%;

      @media print {
        display: none;
      }

      footer {
        background-color: #102427;
        background-image: url('/assets/landing-page/footer-bg@small.svg');
        background-repeat: no-repeat;
        background-position: right bottom;
        min-height: 622px;
        padding: 48px 32px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(5, auto);
        gap: 48px;
        grid-template-areas:
          'address'
          'contact'
          'legal'
          'developers'
          'drivenBy'
          'energyTag'
          'logo';

        @media (min-width: 754px) {
          background-image: url('/assets/landing-page/footer-bg.svg');
          grid-template-areas:
            'logo address legal developers'
            'logo address legal developers'
            'logo energyTag energyTag drivenBy';
          grid-template-rows: auto 1fr;
          grid-template-columns: repeat(4, auto);
          gap: 1vw;
          padding: 100px 24px;

          .logo {
            margin-bottom: 24px;
          }
        }

        @media (min-width: 1164px) {
          grid-template-columns: repeat(4, auto);
          grid-template-rows: auto;
          grid-template-areas:
            'logo address legal developers'
            'logo energyTag legal drivenBy';
          gap: 16px 64px;
        }
      }

      .logo {
        width: 264px;
        grid-area: logo;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .beta-badge-margin {
        margin-top: var(--watt-space-m);
      }

      .address {
        grid-area: address;
      }

      .energy-tag {
        grid-area: energyTag;
      }

      .legal {
        grid-area: legal;
      }

      .developers {
        grid-area: developers;
      }

      .driven-by {
        grid-area: drivenBy;

        .logo {
          width: 160px;
        }
      }

      h4 {
        color: #24b492;
        margin-bottom: 16px;
      }

      p,
      a {
        color: #f5f5f5;
        line-height: 30px;
      }

      ul li {
        padding-left: 0;

        &::before {
          display: none;
        }
      }

      a {
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
    }
  `,
  template: `
    <footer>
      <div class="logo">
        <img eoProductLogo version="secondary" />
        <watt-badge type="version" class="beta-badge-margin"
          >{{ translations.landingPage.footer.beta | transloco }}
        </watt-badge>
      </div>

      <section class="energy-tag">
        <h4 class="headline-4">
          {{ translations.landingPage.footer.section1.heading | transloco }}
        </h4>
        <div>
          <ul>
            <li>
              <a
                (click)="
                  window.open(
                    '/assets/documents/2025_04_11_ETT_DK_GC Scheme_protocol.pdf',
                    '_blank',
                    'noopener noreferrer'
                  )
                "
              >
                {{ translations.landingPage.footer.section1.content.scheme | transloco }}
              </a>
            </li>
            <li>
              <a
                (click)="
                  window.open(
                    '/assets/documents/20250411 ETT GC scheme - Assessment report.docx.pdf',
                    '_blank',
                    'noopener noreferrer'
                  )
                "
              >
                {{ translations.landingPage.footer.section1.content.assessment | transloco }}
              </a>
            </li>
            <li>
              <a
                (click)="
                  window.open(
                    '/assets/documents/Energinet (Track & TRACE)_Certificate of Accreditation 2025.pdf',
                    '_blank',
                    'noopener noreferrer'
                  )
                "
              >
                {{ translations.landingPage.footer.section1.content.certificate | transloco }}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section class="address">
        <h4 class="headline-4">
          {{ translations.landingPage.footer.section2.heading | transloco }}
        </h4>
        <div [innerHTML]="translations.landingPage.footer.section2.content | transloco"></div>
      </section>

      <section class="legal">
        <h4 class="headline-4">
          {{ translations.landingPage.footer.section3.heading | transloco }}
        </h4>
        <div [innerHTML]="translations.landingPage.footer.section3.content | transloco"></div>
      </section>

      <section class="developers">
        <h4 class="headline-4">
          {{ translations.landingPage.footer.section4.heading | transloco }}
        </h4>
        <div
          [innerHTML]="
            translations.landingPage.footer.section4.content
              | transloco: { linkToDevPortal: devPortalHref, icon: openInNewIcon }
          "
        ></div>
      </section>

      <section class="driven-by">
        <h4 class="headline-4">{{ translations.landingPage.footer.drivenBy | transloco }}</h4>
        <img src="assets/images/DataHub_Hvid.png" alt="DataHub - Energinet logo" class="logo" />
      </section>
    </footer>
  `,
})
export class EoFooterComponent {
  protected window = window;
  protected devPortalHref: string = inject(eoApiEnvironmentToken).developerPortal;
  protected openInNewIcon =
    '<span class="mat-icon notranslate material-symbols-sharp mat-icon-no-color">open_in_new</span>';
  protected translations = translations;
}
