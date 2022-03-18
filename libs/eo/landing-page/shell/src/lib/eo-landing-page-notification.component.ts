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

import { EoLandingPageColumnLayoutScam } from './layout/eo-landing-page-column-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-notification',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        @include watt.space-inset-m;

        display: flex;
        justify-content: center;
      }

      .inline-message {
        @include watt.space-inset-m;

        display: flex;
        /* grid-template-columns: 80px 1fr; */
        align-items: center;

        width: 1036px; // Magic number by designer

        background: var(--watt-color-neutral-white);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
      }

      .icon {
        display: block;
        width: calc(12 * var(--watt-space-xs));
        height: calc(12 * var(--watt-space-xs));
        border-radius: 50%;
        margin: 0 auto;
      }

      p {
        color: var(--watt-color-primary-dark);
      }
    `,
  ],
  template: `
    <div class="inline-message">
      <img
        class="icon"
        src="/assets/images/icons/primary-info-icon.svg"
        alt="EnergyOrigin information"
      />
      <div class="eo-margin-left-m">
        <p>
          The Energy Origin Platform is <strong>under development</strong> and
          new functionalities will be released continuously. The first release
          of the platform offers <strong>company login only</strong>. Private
          login via NemID/MitID is intended to form part of one of the next
          releases.
        </p>
      </div>
    </div>
  `,
})
export class EoLandingPageNotificationComponent {}

@NgModule({
  declarations: [EoLandingPageNotificationComponent],
  exports: [EoLandingPageNotificationComponent],
  imports: [EoLandingPageColumnLayoutScam],
})
export class EoLandingPageNotificationScam {}
