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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { EoPrivacyPolicyScam } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-privacy-policy-shell',
  styles: [
    `
      :host {
        display: block;
      }

      .content-wrapper {
        margin: 0 auto; // Center content vertically
        max-width: 994px; // Magic number by designer.
      }
    `,
  ],
  template: `
    <div class="content-wrapper">
      <eo-privacy-policy></eo-privacy-policy>
    </div>
  `,
})
export class EoPrivacyPolicyShellComponent {}

@NgModule({
  imports: [EoPrivacyPolicyScam],
  declarations: [EoPrivacyPolicyShellComponent],
})
export class EoPrivacyPolicyShellScam {}
