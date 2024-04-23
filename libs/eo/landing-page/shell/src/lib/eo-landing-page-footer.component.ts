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

import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoProductLogoDirective, WattIconComponent],
  selector: 'eo-landing-page-footer',
  styles: `
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
        'logo';

      @media (min-width: 754px) {
        background-image: url('/assets/landing-page/footer-bg.svg');
        grid-template-areas:
          'logo logo logo logo'
          'address contact legal developers';
        grid-template-rows: auto 1fr;
        grid-template-columns: repeat(4, auto);
        gap: 1vw;
        padding: 100px 24px;

        .logo {
          margin-bottom: 24px;
        }
      }

      @media (min-width: 1000px) {
        grid-template-columns: repeat(5, auto);
        grid-template-rows: auto;
        grid-template-areas: 'logo address contact legal developers';
        gap: 64px;
      }
    }

    .logo {
      width: 264px;
      grid-area: logo;
    }

    .address {
      grid-area: address;
    }

    .contact {
      grid-area: contact;
    }

    .legal {
      grid-area: legal;
    }

    .developers {
      grid-area: developers;
    }

    h4 {
      color: #24b492;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: 0.54px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    p,
    a {
      color: #f5f5f5;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 31px;
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
  `,
  template: `
    <footer>
      <img eoProductLogo version="secondary" class="logo" />

      <section class="address">
        <h4>Address</h4>
        <p>Tonne Kjærsvej 65<br />7000 Fredericia<br />Denmark<br />CVR: 39315041</p>
      </section>

      <section class="contact">
        <h4>Contact</h4>
        <p>
          +45 70 22 28 10<br />
          <a href="mailto:datahub@energinet.dk">datahub&#64;energinet.dk</a>
        </p>
      </section>

      <section class="legal">
        <h4>Legal</h4>
        <ul>
          <li>
            <a href="">Privacy policy</a>
          </li>
          <li>
            <a href="">Terms of use</a>
          </li>
        </ul>
      </section>

      <section class="developers">
        <h4>Developers</h4>
        <p>Get access to our</p>
        <a [href]="devPortalHref" target="_blank"><watt-icon name="openInNew" />Developer portal</a>
      </section>
    </footer>
  `,
})
export class EoLandingPageFooterComponent {
  protected devPortalHref: string = inject(eoApiEnvironmentToken).developerPortal;
}
