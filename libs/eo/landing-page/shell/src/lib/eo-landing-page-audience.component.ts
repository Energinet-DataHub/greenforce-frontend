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
import { EoLandingPagePresenter } from './eo-landing-page.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-audience',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      :host {
        padding: var(--watt-space-xl);
        background: var(--watt-color-primary-ultralight);
        display: block;

        @include watt.media('<Large') {
          padding: var(--watt-space-l) var(--watt-space-m);
        }
      }

      h2 {
        padding-bottom: var(--watt-space-s);
      }

      .content {
        margin: 0 auto;
        max-width: 960px; /* Magic UX color */
        display: flex;
        justify-content: space-between;

        @include watt.media('<Large') {
          max-width: 100%;
          flex-direction: column-reverse;
        }
      }

      .content-text {
        flex-direction: column;
        padding-bottom: var(--watt-space-l);

        @include watt.media('>=Large') {
          max-width: 457px; /* Magic UX color */
        }
      }

      img {
        margin: 0 auto;
      }
    `,
  ],
  template: `
    <div class="content">
      <img
        width="400"
        src="/assets/images/landing-page/landing-page-office-people.png"
        alt="Company users"
      />
      <div class="content-text">
        <h2>Who is it for?</h2>
        <p>
          This first version of Energy Origin is for
          <strong>companies in Denmark</strong>. Later it will be available for
          private individuals as well.
        </p>
      </div>
    </div>
  `,
})
export class EoLandingPageAudienceComponent {
  constructor(public landingPage: EoLandingPagePresenter) {}
}

@NgModule({
  declarations: [EoLandingPageAudienceComponent],
  exports: [EoLandingPageAudienceComponent],
})
export class EoLandingPageAudienceScam {}
