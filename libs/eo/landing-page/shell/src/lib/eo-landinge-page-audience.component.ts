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
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

import { EoLandingPagePresenter } from './eo-landing-page.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-audience',
  styles: [
    `
      @use '@energinet-datahub/eo/shared/styles/layout' as eo-layout;

      :host {
        @include eo-layout.centered-content;

        display: block;

        background-color: var(--watt-color-focus-selection);
      }
    `,
  ],
  template: `
    <div class="eo-spacing-squished-inset-xxl">
      <eo-media
        [eoMediaGapPixels]="landingPage.gutterPixels"
        [eoMediaMaxWidthPixels]="landingPage.contentMaxWidthPixels"
      >
        <h2>Who is it for?</h2>

        <p>
          This first version of Energy Origin is for
          <strong>companies in Denmark</strong>. Later it will be available for
          private individuals as well.
        </p>

        <img
          eoMediaImage
          eoMediaImageAlign="start"
          [eoMediaImageMaxWidthPixels]="400"
          src="/assets/images/landing-page/landing-page-office-people.png"
          alt="Company users"
        />
      </eo-media>
    </div>
  `,
})
export class EoLandingPageAudienceComponent {
  constructor(public landingPage: EoLandingPagePresenter) {}
}

@NgModule({
  declarations: [EoLandingPageAudienceComponent],
  exports: [EoLandingPageAudienceComponent],
  imports: [EoMediaModule],
})
export class EoLandingPageAudienceScam {}
