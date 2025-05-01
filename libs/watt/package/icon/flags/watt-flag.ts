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
import { Component, input } from '@angular/core';
import { CountryCode } from 'libphonenumber-js';

import { WattIconComponent, WattIconSize } from '@energinet/watt/icon';

import { WattFlagDenmarkComponent } from './watt-flag-dk';
import { WattFlagFinlandComponent } from './watt-flag-fi';
import { WattFlagGermanyComponent } from './watt-flag-de';
import { WattFlagNorwayComponent } from './watt-flag-no';
import { WattFlagPolandComponent } from './watt-flag-pl';
import { WattFlagSwedenComponent } from './watt-flag-se';
import { WattFlagNetherlandsComponent } from './watt-flag-nl';

@Component({
  selector: 'watt-flag',
  imports: [
    WattFlagDenmarkComponent,
    WattFlagFinlandComponent,
    WattFlagGermanyComponent,
    WattFlagNorwayComponent,
    WattFlagPolandComponent,
    WattFlagSwedenComponent,
    WattFlagNetherlandsComponent,
    WattIconComponent,
  ],
  template: `
    <watt-icon [size]="size()" [label]="label()">
      @switch (country()) {
        @case ('DK') {
          <watt-flag-dk />
        }
        @case ('DE') {
          <watt-flag-de />
        }
        @case ('FI') {
          <watt-flag-fi />
        }
        @case ('NO') {
          <watt-flag-no />
        }
        @case ('PL') {
          <watt-flag-pl />
        }
        @case ('SE') {
          <watt-flag-se />
        }
        @case ('NL') {
          <watt-flag-nl />
        }
      }
    </watt-icon>
  `,
})
export class WattFlagComponent {
  /** Country code of the flag. */
  country = input.required<CountryCode>();

  /** Accessible label for the icon. */
  label = input<string>();

  /** Size of the icon. */
  size = input<WattIconSize>('m');
}
