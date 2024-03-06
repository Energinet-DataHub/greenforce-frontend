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
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

import { eoPrivacyPolicyRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, TranslocoPipe],
  selector: 'eo-footer',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        position: relative;
        z-index: 100;
        background: var(--watt-color-neutral-white);
        overflow: hidden;
      }

      .content {
        display: flex;
        padding: var(--watt-space-m);
        flex-direction: column;

        @include watt.media('>=Large') {
          padding: var(--watt-space-xl) var(--watt-space-m);
          gap: calc(var(--watt-space-xl) * 2);
          flex-direction: row;
        }
      }

      .powered-by {
        font-size: 14px;
        color: var(--watt-color-primary-dark);
        line-height: 20px;
        padding-bottom: var(--watt-space-xs);
      }

      .logo {
        width: 100%;
        max-width: 360px; // Magic UX number
        padding-bottom: var(--watt-space-m);
        display: block;
      }

      a {
        color: var(--watt-color-primary);
      }

      .contact-link {
        text-decoration: none;
      }
    `,
  ],
  template: `
    <div class="content">
      <div class="watt-space-stack-l">
        <p class="powered-by">{{ translations.footer.poweredBy | transloco }}</p>
        <img src="/assets/energinet-logo.svg" alt="Energinet" class="logo" />
        <p>
          <a
            aria-label="privacypolicy"
            class="watt-text-s watt-space-stack-s"
            routerLink="/${eoPrivacyPolicyRoutePath}"
            >{{ translations.footer.privacyPolicy | transloco }}</a
          >
        </p>
        <p>
          <a
            href="https://www.was.digst.dk/energioprindelse-dk"
            aria-label="accessibility"
            target="_blank"
            rel="noopener noreferrer"
            class="watt-text-s"
          >
            {{ translations.footer.accessibilityStatement | transloco }}
          </a>
        </p>

        <ng-content />
      </div>

      <div class="watt-space-stack-m">
        <h5 class="watt-space-stack-s">{{ translations.footer.locationHeader | transloco }}</h5>
        <p>
          <span [innerHTML]="translations.footer.address | transloco"></span>
          <br />
          {{ translations.footer.cvr | transloco }}
        </p>
      </div>

      <div>
        <h5 class="watt-space-stack-s">{{ translations.footer.contactHeader | transloco }}</h5>
        <p class="watt-space-stack-s">
          <a
            [attr.href]="'tel:' + (translations.footer.contactPhone | transloco)"
            aria-label="phone"
            class="contact-link"
            >{{ translations.footer.contactPhone | transloco }}</a
          >
        </p>
        <p class="watt-space-stack-s">
          <a
            [attr.href]="'mailto:' + (translations.footer.contactEmail | transloco)"
            aria-label="email"
            class="contact-link"
          >
            {{ translations.footer.contactEmail | transloco }}
          </a>
        </p>
      </div>
    </div>
  `,
})
export class EoFooterComponent {
  protected translations = translations;
}
