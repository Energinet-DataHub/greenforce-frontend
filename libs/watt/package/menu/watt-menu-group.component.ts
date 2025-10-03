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
import { Component, ViewEncapsulation, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'watt-menu-group',
  template: `
    <div class="watt-menu-group">
      @if (label()) {
        <div class="watt-menu-group-heading watt-text-s-highlighted">{{ label() }}</div>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      /* Menu group container */
      .watt-menu-group:not(:last-child) {
        border-bottom: 1px solid var(--watt-menu-divider-color);
        padding-bottom: var(--watt-menu-padding-block);
        margin-bottom: var(--watt-menu-padding-block);
      }

      /* Group heading */
      .watt-menu-group-heading {
        padding-block: var(--watt-menu-padding-block);
        padding-inline: var(--watt-menu-padding-inline);

        /* Align with menu items when icons are present */
        .watt-menu-panel--has-icons & {
          padding-inline-start: calc(var(--watt-menu-padding-inline) + var(--watt-menu-icon-space));
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'watt-menu-group',
  },
})
export class WattMenuGroupComponent {
  /**
   * The label for the menu group.
   */
  label = input<string>('');
}
