/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { Component, Inject, SkipSelf } from '@angular/core';
import { RouterLink } from '@angular/router';

import { disabledAttributeToken } from '../disabled-attribute-token';

@Component({
  exportAs: 'wattSecondaryLinkButton',
  selector: 'watt-secondary-link-button',
  styleUrls: ['./watt-secondary-link-button.component.scss'],
  templateUrl: './watt-secondary-link-button.component.html',
})
export class WattSecondaryLinkButtonComponent {
  constructor(
    @SkipSelf() public routerLink: RouterLink,
    @Inject(disabledAttributeToken) public isDisabled: boolean
  ) {}
}
