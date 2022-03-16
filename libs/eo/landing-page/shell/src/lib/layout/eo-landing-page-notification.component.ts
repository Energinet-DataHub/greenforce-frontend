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

import { EoInlineMessageScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

const selector = 'eo-landing-page-notification';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
      }
      .${selector}__eo-inline-message {
        margin: var(--watt-space-m) auto;
        width: calc(259 * var(--watt-space-xs));
      }
    `,
  ],
  template: `
    <eo-inline-message
      icon="/assets/images/icons/primary-info-icon.svg"
      class="${selector}__eo-inline-message"
    >
      <p>
        The Energy Origin Platform is <b>under development</b> and new
        functionalities will be released continuously. The first release of the
        platform offers <b>business login only</b>. Private login via
        NemID/MitID is intended to form part of one of the next releases.
      </p>
    </eo-inline-message>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageNotificationComponent {}

@NgModule({
  declarations: [EoLandingPageNotificationComponent],
  exports: [EoLandingPageNotificationComponent],
  imports: [EoInlineMessageScam],
})
export class EoLandingPageNotificationScam {}
