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
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const selector = 'watt-card-title';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      ${selector} h4, ${selector} h3 {
        color: var(--watt-typography-text-color);
        margin: 0;
      }
    `,
  ],
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'cssClass()',
  },
})
export class WattCardTitleComponent {
  cssClass = () => 'watt-card__title watt-space-stack-m';
}
