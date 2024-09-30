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
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/eo/translations';

const selector = 'eo-consent-permissions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  imports: [TranslocoPipe],
  standalone: true,
  styles: `
    ${selector} .permissions {
      margin-bottom: var(--watt-space-m);
      list-style: none !important;
      padding: 0;

      .permission {
        &::before {
          display: none;
        }
        padding: var(--watt-space-m) 0;
        border-bottom: 1px solid var(--watt-color-neutral-grey-400);

        h4 {
          margin-top: 0;
        }

        .description {
          margin-top: var(--watt-space-s);
        }
      }
    }
  `,
  template: `
    <ul class="permissions">
      @for (permission of permissions; track permission) {
        <li class="permission">
          <h4>{{ permission[1].title | transloco }}</h4>
          <p class="watt-text-s description">{{ permission[1].description | transloco }}</p>
        </li>
      }
    </ul>

    <div
      [innerHTML]="
        translations.consentPermissions.description
          | transloco
            : {
                organizationName: serviceProviderName,
              }
      "
    ></div>
  `,
})
export class EoConsentPermissionsComponent {
  @Input({ required: true }) serviceProviderName!: string;

  protected translations = translations;
  protected permissions = Object.entries(translations.consentPermissions.permissions);
}
