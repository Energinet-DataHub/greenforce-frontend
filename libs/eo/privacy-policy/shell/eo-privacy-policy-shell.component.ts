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
  ViewEncapsulation,
} from '@angular/core';

import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/components/ui-scroll-view';
import { EoHtmlDocComponent } from '@energinet-datahub/eo/shared/components/ui-html-doc';

const selector = 'eo-auth-terms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    EoScrollViewComponent,
    EoHtmlDocComponent,
  ],
  selector,
  styles: [
    `
      ${selector} {
        --eo-scroll-view-max-height: fit-content;
        display: flex;
        justify-content: center;

        @media print {
          --eo-scroll-view-padding: 0;
        }

        .privacy-policy {
          max-width: 1500px;
        }
      }
    `,
  ],
  template: `
    <eo-scroll-view class="privacy-policy">
      <eo-html-doc [path]="path" />
    </eo-scroll-view>
  `,
})
export class EoPrivacyPolicyShellComponent {
  path = 'assets/privacy-policy/${lang}.html';
}
