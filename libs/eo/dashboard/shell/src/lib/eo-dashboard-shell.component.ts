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
} from '@angular/core';

import { EoInlineMessageScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { WattIconModule } from '@energinet-datahub/watt';

const selector = 'eo-dashboard-shell';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      ${selector} {
        display: block;
      }
      .${selector}__p {
        @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
      }
      .${selector}__eo-inline-message {
        display: block;
        margin-bottom: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <eo-inline-message type="warning" class="${selector}__eo-inline-message">
      <watt-icon name="primary_info_icon" icon></watt-icon>
      <p class="${selector}__p" content>
      The Energy Origin Platform is <strong>under development</strong> and new functionalities will be released continuously.
      The first release of the platform only offers <strong>data for companies</strong>.
      Data for private users is intended to form part of one of the next releases.
      More functionality will be released on an ongoing basis. If you want to
      influence the new functionality, join us at our
      <a href="https://www.linkedin.com/groups/12643238/" target="_blank"
        >LinkedIn group</a
      >.
      </p>
    </eo-inline-message>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoDashboardShellComponent {}

@NgModule({
  imports: [WattIconModule, EoInlineMessageScam],
  declarations: [EoDashboardShellComponent],
  exports: [EoDashboardShellComponent],
})
export class EoDashboardShellScam {}
