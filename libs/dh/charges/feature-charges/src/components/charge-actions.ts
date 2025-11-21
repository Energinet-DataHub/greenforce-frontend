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
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';
import { WATT_MENU } from '@energinet/watt/menu';

@Component({
  selector: 'dh-charge-actions',
  imports: [TranslocoDirective, WattButtonComponent, WattIconComponent, WATT_MENU],
  template: `
    <ng-container *transloco="let t; prefix: 'charges.charge.actions'">
      <watt-button variant="secondary" [wattMenuTriggerFor]="menu">
        {{ t('menu') }}
        <watt-icon name="plus" />
      </watt-button>
      <watt-menu #menu>
        <watt-menu-item>{{ t('edit') }}</watt-menu-item>
        <watt-menu-item>{{ t('stop') }}</watt-menu-item>
      </watt-menu>
    </ng-container>
  `,
})
export class DhChargeActions {}
