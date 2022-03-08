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
  Component,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { EoLandingPageColumnLayoutScam } from './eo-landing-page-column-layout.component';

const selector = 'eo-landing-page-notification';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
      }

      .${selector}__content {
        display: grid;
        grid-template-columns: 80px 1fr;
        align-items: center;
        background: var(--watt-color-neutral-white);
        margin: var(--watt-space-m) auto;
        width: calc(259 * var(--watt-space-xs));
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
      }

      .${selector}__icon {
        display: block;
        width: calc(12 * var(--watt-space-xs));
        height: calc(12 * var(--watt-space-xs));
        border-radius: 50%;
        margin: 0 auto;
      }

      .${selector}__p {
        @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
        padding-right: calc(4 * var(--watt-space-xs));
        color: var(--watt-color-primary-dark);
      }
    `,
  ],
  template: `
    <div class="${selector}__content">
      <div>
        <img
          class="${selector}__icon"
          src="/assets/images/icons/primary-info-icon.svg"
          alt="EnergyOrigin information"
        />
      </div>
      <div>
        <p class="${selector}__p">
          The Energy Origin Platform is <b>under development</b> and new functionalities will be released continuously.
          The first release of the platform offers <b>company login only</b>. Private login via NemID/MitID is intended to form part of one of the next releases.
        </p>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageNotificationComponent {}

@NgModule({
  declarations: [EoLandingPageNotificationComponent],
  exports: [EoLandingPageNotificationComponent],
  imports: [EoLandingPageColumnLayoutScam],
})
export class EoLandingPageNotificationScam {}
