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
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  viewChild,
  AfterContentInit,
  contentChildren,
} from '@angular/core';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { WattMenuItemComponent } from './watt-menu-item.component';

/**
 * Watt Menu Component
 *
 * A wrapper around Angular Material's menu component that provides consistent styling
 * and integration with the Watt design system.
 *
 * @example Basic usage
 * ```html
 * <watt-button [wattMenuTriggerFor]="menu">
 *   Open Menu
 * </watt-button>
 *
 * <watt-menu #menu>
 *   <watt-menu-item>Option 1</watt-menu-item>
 *   <watt-menu-item>Option 2</watt-menu-item>
 * </watt-menu>
 * ```
 *
 * @example With groups
 * ```html
 * <watt-menu #menu>
 *   <watt-menu-group label="File">
 *     <watt-menu-item>New</watt-menu-item>
 *     <watt-menu-item>Open</watt-menu-item>
 *   </watt-menu-group>
 *
 *   <watt-menu-group label="Edit">
 *     <watt-menu-item>Cut</watt-menu-item>
 *     <watt-menu-item>Copy</watt-menu-item>
 *   </watt-menu-group>
 * </watt-menu>
 * ```
 */
@Component({
  selector: 'watt-menu',
  template: `
    <mat-menu
      #menu="matMenu"
      [class]="'watt-menu-panel' + (hasIcons ? ' watt-menu-panel--has-icons' : '')"
    >
      <ng-content select="watt-menu-group, watt-menu-item" />
    </mat-menu>
  `,
  styles: [
    `
      :root {
        --watt-menu-padding-block: var(--watt-space-s);
        --watt-menu-padding-inline: var(--watt-space-m);
        --watt-menu-item-gap: var(--watt-space-s);
        --watt-menu-icon-space: calc(var(--watt-menu-icon-size) + var(--watt-menu-item-gap));
        --watt-menu-icon-size: var(--watt-icon-size-s);
      }

      /* Menu panel styles */
      .watt-menu-panel {
        /* Override Material menu padding to have consistent spacing */
        .mat-mdc-menu-content {
          padding-block: var(--watt-menu-padding-block);
        }

        /* When menu has no icons, hide the icon space entirely */
        &:not(.watt-menu-panel--has-icons) .watt-menu-item-icon {
          display: none;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMenuModule],
  exportAs: 'wattMenu',
})
export class WattMenuComponent implements AfterContentInit {
  /**
   * Reference to the underlying MatMenu instance.
   * @ignore
   */
  menu = viewChild.required<MatMenu>('menu');

  /**
   * All menu items in this menu.
   * @ignore
   */
  menuItems = contentChildren(WattMenuItemComponent, { descendants: true });

  /**
   * Whether any menu item has an icon.
   * @ignore
   */
  hasIcons = false;

  ngAfterContentInit(): void {
    // Check if any menu item has an icon
    this.hasIcons = this.menuItems().some((item) => item.hasIcon);

    // Notify all menu items about the icon state
    this.menuItems().forEach((item) => {
      item.menuHasIcons = this.hasIcons;
    });
  }
}
