//#region License
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
//#endregion
import { Component } from '@angular/core';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-customer-protected',
  imports: [WattIconComponent, TranslocoDirective, VaterStackComponent],
  styles: `
    :host {
      display: flex;
    }
    .protected-address {
      background: var(--watt-color-secondary-ultralight);
      color: var(--watt-color-neutral-grey-800);
      border-radius: 12px;
      align-self: start;
    }
  `,
  template: `
    <div
      *transloco="let t; read: 'meteringPoint.overview.customer'"
      vater-stack
      direction="row"
      gap="s"
      class="watt-space-inset-squish-s watt-space-stack-s protected-address"
    >
      <watt-icon size="s" name="warning" />
      <span class="watt-text-s">{{ t('protectedAddress') }}</span>
    </div>
  `,
})
export class DhCustomerProtectedComponent {}
