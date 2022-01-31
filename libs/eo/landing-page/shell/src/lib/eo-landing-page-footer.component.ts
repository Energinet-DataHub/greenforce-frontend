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
      ${selector} {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        background: var(--watt-color-neutral-white);
        padding: var(--watt-space-l) var(--watt-space-m); // No mixing exists for "space-inset-stretch-l", see: C:lib/foundations/spacing/_spacing.import.scss

        .${selector}__link {
          color: var(
            --watt-color-primary
          ); // This overrides the '--watt-color-primary-dark' color which is added by a class on the element
        }

        .${selector}__p--black {
          color: var(
            --watt-color-neutral-black
          ); // This overrides the default '--watt-color-primary-dark' color
        }

        .${selector}__p--stack-xs {
          @include watt.space-stack-xs; // This adds the spacing between the text and the Energinet logo
        }

        .${selector}__h5 {
          @include watt.typography-watt-headline-5; // This overrides the styles applied from Angular Material on h5 tags
        }

        .${selector}__img {
          display: block;
          width: calc(90 * var(--watt-space-xs));
          height: calc(12 * var(--watt-space-xs));
        }
      }
    `,
  ],
  template: `
    <section>
      <p class="${selector}__p--stack-xs watt-text-s">Powered by</p>
      <img
        src="/assets/energinet-logo.svg"
        alt="Energinet"
        class="${selector}__img watt-space-stack-l"
      />
    </section>
    <section>
      <h5 class="${selector}__h5">Address</h5>
      <p class="${selector}__p--black watt-text-s">
        Tonne Kjærsvej 65<br />
        7000 Fredericia<br />
        Danmark<br />
        CVR: 28980671
      </p>
    </section>
    <section>
      <h5 class="${selector}__h5">Contact</h5>
      <a
        href="tel:+4588446633"
        class="${selector}__link watt-text-s"
        aria-label="phone"
        >+45 88 44 66 33</a
      ><br />
      <a
        href="mailto:datahub@energinet.dk"
        class="${selector}__link watt-text-s"
        aria-label="mail"
        >datahub@energinet.dk</a
      >
    </section>
  `,
})
export class EoLandingPageFooterComponent {}

@NgModule({
  declarations: [EoLandingPageFooterComponent],
  exports: [EoLandingPageFooterComponent],
})
export class EoLandingPageFooterScam {}
