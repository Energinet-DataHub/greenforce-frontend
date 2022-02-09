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
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { WattButtonModule, WattCheckboxModule } from '@energinet-datahub/watt';
import { EoAuthTermsStore } from './eo-auth-terms.store';

// @todo: Do we import the whole module, or just the scam for the header component?
import { UiPageTemplatesModule } from '@energinet-datahub/eo/shared/ui-page-templates';

const selector = 'eo-auth-terms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      .${selector}__page {
        display: block;
        width: calc(200 * var(--watt-space-xs));
        margin: 0 auto;
        margin-bottom: var(--watt-space-l);

        > h1 {
          @include watt.typography-watt-headline-1; // Mis-match with styles in Figma(?)
          text-transform: none; // Override .watt-headline-1
          margin-top: var(--watt-space-l);
          margin-bottom: var(--watt-space-l);
        }

        // This is the wrapper for the privacy policy
        .${selector}__content {
          border-radius: var(--watt-space-xs);
          word-break: break-word;
          background: var(--watt-color-neutral-white);
        }

        // This is the contents of the privacy policy with the custom scrollbar
        article {
          max-height: calc(100 * var(--watt-space-xs));
          word-break: break-word;
          overflow-y: scroll;
          padding-right: calc(4 * var(--watt-space-xs));
          &::-webkit-scrollbar {
            width: 6px;
          }
          &::-webkit-scrollbar-track {
            background: var(--watt-color-neutral-white);
            border-radius: 50px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: var(--watt-color-primary);
            border-radius: 50px;
          }
        }

        label {
          cursor: pointer;
          text-transform: none; // Override .watt-label, which uppercases labels
        }

        watt-button[variant='secondary'] {
          margin-right: calc(2 * var(--watt-space-xs));
        }
      }
    `,
  ],
  template: `
    <eo-header [showStartButton]="false"></eo-header>
    <div class="${selector}__page">
      <h1>Read and accept our privacy policy</h1>
      <div class="watt-space-inset-m watt-space-stack-l ${selector}__content">
        <article>
          <h3>Privacy Policy</h3>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
          <p>
            longwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongwordlongword.
          </p>
        </article>
      </div>

      <div class="watt-space-stack-l">
        <watt-checkbox [(ngModel)]="hasAcceptedTerms"
          >I have seen the privacy policy</watt-checkbox
        >
      </div>

      <watt-button variant="secondary" (click)="onCancel()">Back</watt-button>
      <watt-button variant="primary" (click)="onAccept()">Accept terms</watt-button>

    </div>
    <eo-footer></eo-footer>
  `,
})
export class EoAuthFeatureTermsComponent {
  terms: Observable<string> = this.store.getTerms$;
  hasAcceptedTerms = false;

  constructor(private store: EoAuthTermsStore) { }

  onCancel(): void {
    // this.store.onLogOut...
    alert('Cancelled - Log out & Navigate to landing page');
  }

  onAccept(): void {
    if (this.hasAcceptedTerms) {
      // this.store.onAcceptTerms...
      alert('Accepted - Navigate to the dashboard page');
    }
    else {
      alert('FAIL - You need to check the checkbox');
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
    UiPageTemplatesModule
  ],
})
export class EoAuthFeatureTermsScam {}
