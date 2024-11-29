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
