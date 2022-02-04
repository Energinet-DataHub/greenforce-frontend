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
import { WattButtonModule } from '@energinet-datahub/watt';
import { WattCheckboxModule } from '@energinet-datahub/watt';
import { FormsModule } from '@angular/forms';

const selector = 'eo-auth-terms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
    @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: flex;
        justify-content: center;
        section {
          .${selector}__heading {
            // Figma says it is type: headline-3, with the following styles in Figma:
            // font-size: 32px;
            // line-height: 42px;
            // font-weight: 600;

            // We should then use: watt.typography-watt-headline-3
            @include watt.typography-watt-headline-1; // Mis-match with styles in Figma(?)
            text-transform: none; // Override .watt-headline-1
            // font-size: 36px;
            // line-height: 54px;
            // font-weight: 600;
          }
          .${selector}__heading--level3 {
            // Figma says it is type: headline-3, with the following styles in Figma:
            // font-size: 16px;
            // line-height: 24px;
            // font-weight: 600;

            // We should then use: watt.typography-watt-headline-3
            @include watt.typography-watt-headline-3; // Mis-match with styles in Figma(?)
            // But that adds:
            // font-size: 28px;
            // line-height: 42px;
            // font-weight: 600;
          }

          .${selector}__content {
            background: var(--watt-color-neutral-white);
            border-radius: var(--watt-space-xs);
          }

          article {
            height: calc(100 * var(--watt-space-xs));
            width: calc(200 * var(--watt-space-xs));
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

          watt-button[variant="secondary"] {
            margin-right: calc(2 * var(--watt-space-xs));
          }

        }
      }
    `,
  ],
  template: `
  <section>
    <h1 class="${selector}__heading">Read and accept our privacy policy</h1>
    <div class="watt-space-inset-m watt-space-stack-l ${selector}__content">
      <article>
        <h3 class="${selector}__heading--level3">Privacy Policy</h3>
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
      <watt-checkbox [(ngModel)]="hasAcceptedTerms">I have seen the privacy policy</watt-checkbox>
    </div>

    <watt-button variant="secondary">Back</watt-button>
    <watt-button variant="primary">Accept terms</watt-button>

  </section>
  `,
})
export class EoAuthFeatureTermsComponent {

  hasAcceptedTerms = false;

}

@NgModule({
  declarations: [EoAuthFeatureTermsComponent],
  imports: [FormsModule, WattButtonModule, WattCheckboxModule]
})
export class EoAuthFeatureTermsScam {}
