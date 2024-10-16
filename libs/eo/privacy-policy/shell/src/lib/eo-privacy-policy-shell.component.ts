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

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { translations } from '@energinet-datahub/eo/translations';

import { EoHeaderComponent } from '@energinet-datahub/eo/shared/components/ui-header';
import { EoFooterComponent } from '@energinet-datahub/eo/shared/components/ui-footer';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/components/ui-scroll-view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-privacy-policy-shell',
  imports: [
    TranslocoPipe,
    WattEmptyStateComponent,
    EoFooterComponent,
    EoHeaderComponent,
    EoScrollViewComponent,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .content-wrapper {
        margin: 0 auto; // Center content vertically
        max-width: 994px; // Magic number by designer.
      }

      eo-header,
      eo-footer {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
      }

      .content-box {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: auto;
      }

      .content-wrapper {
        width: 820px; // Magic number by designer.
      }
    `,
  ],
  template: `
    <eo-header />
    <div class="content-box watt-space-inset-l">
      <div class="eo-layout-centered-content">
        <div class="content-wrapper">
          <eo-scroll-view class="watt-space-stack-l">
            <watt-empty-state
              icon="danger"
              [title]="translations.terms.fetchingTermsError.title | transloco"
              [message]="translations.terms.fetchingTermsError.message | transloco"
            />
          </eo-scroll-view>
        </div>
      </div>
    </div>

    <eo-footer />
  `,
})
export class EoPrivacyPolicyShellComponent {
  translations = translations;
}
