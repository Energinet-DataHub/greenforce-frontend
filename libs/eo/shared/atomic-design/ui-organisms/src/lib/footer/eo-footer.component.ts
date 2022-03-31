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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-footer',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      @use '@energinet-datahub/eo/shared/styles/spacing' as eo-spacing;

      :host {
        @include eo-spacing.stretched-inset-l($padding: true);

        position: relative;
        z-index: 100;
        display: block;

        background: var(--watt-color-neutral-white);
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
      }

      a {
        color: var(--watt-color-primary);
      }

      .text--primary-dark {
        color: var(--watt-color-primary-dark);
      }

      .section-headline {
        @include watt.space-stack-s;
      }

      .logo {
        display: block;

        width: 360px;
        height: 48px;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 4fr 3fr 6fr;
      }
    `,
  ],
  template: `
    <div class="content-grid">
      <div>
        <p class="watt-text-s text--primary-dark">Powered by</p>

        <img
          src="/assets/energinet-logo.svg"
          alt="Energinet"
          class="logo watt-space-stack-l"
        />

        <ng-content></ng-content>
      </div>

      <div>
        <h5 class="section-headline">Address</h5>

        <p class="watt-text-s">
          Tonne Kjærsvej 65<br />
          7000 Fredericia<br />
          Danmark<br />
          CVR: 39315041
        </p>
      </div>

      <div>
        <h5 class="section-headline">Contact</h5>

        <p>
          <a href="tel:+4570222810" class="watt-text-s" aria-label="Phone"
            >+45 70 22 28 10
          </a>
        </p>

        <p>
          <a
            href="mailto:datahub@energinet.dk"
            class="watt-text-s"
            aria-label="Email"
            >datahub@energinet.dk</a
          >
        </p>
      </div>
    </div>
  `,
})
export class EoFooterComponent {}

@NgModule({
  declarations: [EoFooterComponent],
  exports: [EoFooterComponent],
})
export class EoFooterScam {}
