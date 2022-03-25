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
import { EoInlineMessageScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';

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

      eo-inline-message {
        max-width: var(--eo-landing-page-content-max-width);
      }
    `,
  ],
  template: `
    <eo-inline-message>
      <watt-icon name="primary_info" [size]="iconSize.Large"></watt-icon>

      <p>
        The Energy Origin Platform is <strong>under development</strong> and new
        functionalities will be released continuously. For now there is
        <strong>only this page</strong>, soon it will be possible for companies
        to login, to see the first bit of functionality.
      </p>
    </eo-inline-message>
  `,
})
export class EoLandingPageNotificationComponent {
  iconSize = WattIconSize;
}

@NgModule({
  declarations: [EoLandingPageNotificationComponent],
  exports: [EoLandingPageNotificationComponent],
  imports: [WattIconModule, EoInlineMessageScam],
})
export class EoLandingPageNotificationScam {}
