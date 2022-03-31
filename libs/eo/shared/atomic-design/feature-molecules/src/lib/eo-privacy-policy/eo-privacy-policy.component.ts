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
  Output,
} from '@angular/core';
import { EoScrollViewScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { PushModule } from '@rx-angular/template';
import { Observable } from 'rxjs';

import { EoPrivacyPolicyStore } from './eo-privacy-policy.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-privacy-policy',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
      }

      small {
        color: var(--watt-color-neutral-grey-700);
      }
    `,
  ],
  template: `
    <eo-scroll-view>
      <small>Version {{ version$ | push }}</small>

      <div [innerHTML]="privacyPolicy$ | push"></div>
    </eo-scroll-view>
  `,
  viewProviders: [EoPrivacyPolicyStore],
})
export class EoPrivacyPolicyComponent {
  @Output() versionChange = this.store.version$;

  version$: Observable<string> = this.store.version$;
  privacyPolicy$: Observable<string> = this.store.privacyPolicy$;

  constructor(private store: EoPrivacyPolicyStore) {}
}

@NgModule({
  declarations: [EoPrivacyPolicyComponent],
  exports: [EoPrivacyPolicyComponent],
  imports: [EoScrollViewScam, PushModule],
})
export class EoPrivacyPolicyScam {}
