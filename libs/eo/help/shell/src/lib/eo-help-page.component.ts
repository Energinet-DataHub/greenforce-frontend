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
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoPipe],
  standalone: true,
  selector: 'eo-help-page',
  styles: [
    `
      eo-help-page a {
        display: block;
      }

      eo-help-page li {
        margin-bottom: var(--watt-space-m);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [innerHTML]="
        translations.help.content
          | transloco
            : {
                faqLink: routes.help + '/' + routes.faq,
                introductionLink: routes.help + '/' + routes.introduction
              }
      "
    ></div>
  `,
})
export class EoHelpPageComponent {
  protected routes = eoRoutes;
  protected translations = translations;
}
