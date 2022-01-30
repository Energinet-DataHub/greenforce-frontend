/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

const selector = 'eo-landing-page-footer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
    @use '@energinet-datahub/watt/utils' as watt;
    // @todo: Get the line-height we should use - Overrides are used multiple places below in order to match with what is in Figma
    ${selector} {

      // General styles for the 'eo-landing-page-footer' tag
      display: grid;
      // @todo: Get the column sizes from Kenneth
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      position: absolute;
      bottom: 0;
      // filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.1)); // -> Figma style - Which one to use(?)
      box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.3); // Equivalent to Watt "shadow-s" style - Which one to use(?)
      background: var(--watt-color-neutral-white);
      padding: var(--watt-space-l) var(--watt-space-m); // No mixing exists for "inset-stretch-l", see: C:lib/foundations/spacing/_spacing.import.scss

      // Column 1
      section:first-of-type {
        p {
          @include watt.space-stack-xs;
          @include watt.typography-watt-text-s; // Adds line-height: 1.5;
          // line-height: 24px; // Override: This line-height corresponds to what is added in Figma(?)
        }
        img {
          // @todo: Get the image dimensions from Kenneth
          display: block;
          width: 360px;
          height: 48px;
          @include watt.space-stack-l;
        }
        a {
          @include watt.typography-watt-text-s; // Adds line-height: 1.5;
          // line-height: 24px; // Override: This line-height corresponds to what is added in Figma(?)
          color: var(--watt-color-primary);
        }
      }

      // Column 2
      section:nth-child(2) {
        p {
          @include watt.typography-watt-text-s; // Adds line-height: 1.5;
          // line-height: 24px; // Override: This line-height corresponds to what is added in Figma(?)
          color: var(--watt-color-neutral-black);
          margin: 0; // This resets a margin-bottom which is applied from Angular Material on the P tag
        }
      }

      // Column 3
      section:last-of-type {
        a {
          @include watt.typography-watt-text-s; // Adds line-height: 1.5;
          // line-height: 24px; // Override: This line-height corresponds to what is added in Figma(?)
          color: var(--watt-color-primary);
          display: block;
        }
      }

      // Column 2 & Column 3 shared
      section:nth-child(2), section:last-of-type {
        h5 {
          @include watt.typography-watt-text-m;
          font-weight: 600; // Overrides the font-weight from 'watt.typography-watt-text-m', in order to match the Figma styles

          // This is the mixin available in watt, for level 5 headings -> Does not match with the styles in Figma((font-size & line-height))...
          // ... But should be the one we can use for level 5 headings(?)
          // @include watt.typography-watt-headline-5;
        }
      }
    }
    `,
  ],
  template: `
      <section>
        <p>Powered by</p>
        <img src="assets/energinet-logo.svg" alt="EnergyOrigin" />
        <a href="#">Privacy Policy</a>
      </section>
      <section>
        <h5>Address</h5>
        <p>Tonne Kjærsvej 65</p>
        <p>7000 Fredericia</p>
        <p>Danmark</p>
        <p>CVR: 28980671</p>
      </section>
      <section>
        <h5>Contact</h5>
        <a href="tel:+4588446633">+45 88 44  66 33</a>
        <a href="mailto:datahub@energinet.dk">datahub@energinet.dk</a>
      </section>
  `,
})
export class EoLandingPageFooterComponent {
}

@NgModule({
  declarations: [EoLandingPageFooterComponent],
  exports: [EoLandingPageFooterComponent],
  imports: [],
})
export class EoLandingPageFooterScam {}
