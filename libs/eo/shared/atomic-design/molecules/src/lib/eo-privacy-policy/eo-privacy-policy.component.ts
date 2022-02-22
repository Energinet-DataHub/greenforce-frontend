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
import { EoPrivacyPolicyStore } from './eo-privacy-policy.store';
import { EoScrollViewScam } from '@energinet-datahub/eo/shared/atomic-design/atoms';
import { Observable } from 'rxjs';
import { PushModule } from '@rx-angular/template';

const selector = 'eo-privacy-policy';

@Component({
  selector,
  template: `
    <h1 class="${selector}__heading">{{ headline$ | push }}</h1>
    <eo-scroll-view>
      <div [innerHTML]="terms$ | push"></div>
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
          text-transform: none; // Override .watt-headline-1
          margin-bottom: var(--watt-space-l);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoPrivacyPolicyComponent {
  version$: Observable<string> = this.store.version$;
  headline$: Observable<string> = this.store.headline$;
  terms$: Observable<string> = this.store.privacyPolicy$;

  constructor(private store: EoPrivacyPolicyStore) {}
}

@NgModule({
  imports: [EoScrollViewScam, PushModule],
  providers: [EoPrivacyPolicyStore],
  declarations: [EoPrivacyPolicyComponent],
  exports: [EoPrivacyPolicyComponent],
})
export class EoPrivacyPolicyScam {}
