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
import { MatMenuItem } from '@angular/material/menu';

@Component({
  selector: 'watt-menu-item',
  imports: [MatMenuItem],
  template: `<button mat-menu-item [disabled]="disabled()">
    <span class="watt-menu-item-content">
      <span class="watt-menu-item-icon">
        <ng-content select="watt-icon" />
      </span>
      <ng-content />
    </span>
  </button>`,
  styles: [
    `
      watt-menu-item {
        .mat-mdc-menu-item {
          padding-inline: var(--watt-menu-padding-inline);
        }

        .watt-menu-item-content {
          display: flex;
          align-items: center;
          gap: var(--watt-menu-item-gap);
          width: 100%;
        }

        .watt-menu-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--watt-menu-icon-size);
          height: var(--watt-menu-icon-size);
          flex-shrink: 0;

          /* Icon space visibility is controlled by parent menu CSS */

          watt-icon {
            display: flex;
          }
        }

        .watt-menu-item-icon--show:empty {
          visibility: hidden;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.disabled]': 'disabled() || null',
  },
})
export class WattMenuItemComponent {
  /**
   * Whether the menu item is disabled.
   */
  disabled = input(false);
}
