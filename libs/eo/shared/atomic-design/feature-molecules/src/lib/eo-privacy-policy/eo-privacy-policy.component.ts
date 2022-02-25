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
  Output,
} from '@angular/core';
import { EoPrivacyPolicyStore } from './eo-privacy-policy.store';
import { EoScrollViewScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { Observable } from 'rxjs';
import { PushModule } from '@rx-angular/template';

const selector = 'eo-privacy-policy';

@Component({
  providers: [EoPrivacyPolicyStore],
  selector,
  template: `
    <h1 class="${selector}__heading">Privacy Policy</h1>
    <eo-scroll-view>
      <p class="${selector}__paragraph">Version {{ version$ | push }}</p>
      <div [innerHTML]="privacyPolicy$ | push"></div>
    </eo-scroll-view>
  `,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: block;
        width: calc(200 * var(--watt-space-xs));
        > .${selector}__heading {
          // Overrides Angular Material styles for the h1 element
          @include watt.typography-watt-headline-1;
          text-transform: none; // Override .watt-headline-1
        }
        .${selector}__paragraph {
          @include watt.typography-watt-text-s;
          color: var(--watt-color-neutral-grey-600);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoPrivacyPolicyComponent {
  version$: Observable<string> = this.store.version$;
  privacyPolicy$: Observable<string> = this.store.privacyPolicy$;

  @Output() versionChange = this.store.version$;

  constructor(private store: EoPrivacyPolicyStore) {}
}

@NgModule({
  imports: [EoScrollViewScam, PushModule],
  declarations: [EoPrivacyPolicyComponent],
  exports: [EoPrivacyPolicyComponent],
})
export class EoPrivacyPolicyScam {}
