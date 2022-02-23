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
import {
  EoFooterScam,
  EoHeaderScam,
} from '@energinet-datahub/eo/shared/ui-page-templates';
import { WattButtonModule, WattCheckboxModule } from '@energinet-datahub/watt';
import { EoAuthTermsStore } from './eo-auth-terms.store';
import { EoLogOutStore } from '@energinet-datahub/ett/auth/data-access-security';
import { FormsModule } from '@angular/forms';
import { EoPrivacyPolicyScam } from '@energinet-datahub/eo-shared-atomic-design-feature-molecules';

const selector = 'eo-auth-terms';

@Component({
  providers: [EoLogOutStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      .${selector}__content {
        eo-privacy-policy {
          margin: var(--watt-space-l) auto;

          eo-scroll-view {
            margin-bottom: var(--watt-space-l);
          }
        }

        > div {
          width: calc(200 * var(--watt-space-xs));
          margin: 0 auto var(--watt-space-l);

          watt-button[variant='secondary'] {
            margin-right: calc(2 * var(--watt-space-xs));
          }
        }
      }
    `,
  ],
  template: `
    <eo-header></eo-header>

    <div class="${selector}__content">
      <!-- @todo Should we pass in the "terms_url" to this component - It does not make sense to have it as a dynamic value? Just use "/terms" -->
      <eo-privacy-policy
        (versionChange)="onVersionChange($event)"
      ></eo-privacy-policy>

      <div>
        <div class="watt-space-stack-l">
          <watt-checkbox [(ngModel)]="hasAcceptedTerms"
            >I have seen the privacy policy</watt-checkbox
          >
        </div>

        <watt-button
          variant="secondary"
          aria-labelledby="Cancel"
          (click)="onCancel()"
          >Back
        </watt-button>
        <watt-button
          variant="primary"
          aria-labelledby="Accept"
          (click)="onAccept()"
          >Accept terms
        </watt-button>
      </div>
    </div>
    <eo-footer></eo-footer>
  `,
})
export class EoAuthFeatureTermsComponent {
  hasAcceptedTerms = false;

  constructor(
    private store: EoAuthTermsStore,
    private logOutStore: EoLogOutStore
  ) {}

  onVersionChange(version: string): void {
    this.store.onVersionChange(version);
  }

  onCancel(): void {
    this.logOutStore.onLogOut();
  }

  onAccept(): void {
    if (this.hasAcceptedTerms) {
      this.store.onAcceptTerms();
    } else {
      // Error handling - Let the user know that the checkbox needs to be checked before terms can be accepted
    }
  }
}

@NgModule({
  providers: [EoAuthTermsStore],
  declarations: [EoAuthFeatureTermsComponent],
  imports: [
    FormsModule,
    WattButtonModule,
    WattCheckboxModule,
    EoFooterScam,
    EoHeaderScam,
    EoPrivacyPolicyScam,
  ],
})
export class EoAuthFeatureTermsScam {}
