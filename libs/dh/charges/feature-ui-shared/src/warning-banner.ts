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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VATER } from '@energinet/watt/vater';
import { WattIconComponent } from '@energinet/watt/icon';

@Component({
  selector: 'dh-charges-warning-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VATER, WattIconComponent],
  styles: `
    :host {
      display: block;
      border-radius: 4px;
      background-color: var(--watt-color-state-warning-light);
      border: 1px solid var(--watt-color-state-warning);
    }
  `,
  template: `
    <vater-stack fill="vertical" direction="row" gap="s" offset="m">
      <watt-icon size="s" name="warning" />
      <ng-content />
    </vater-stack>
  `,
})
export class DhChargesWarningBanner {}
