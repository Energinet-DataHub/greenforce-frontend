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
import { Directive, inject, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { WattMenuComponent } from './watt-menu.component';

/**
 * Watt Menu Trigger Directive
 *
 * A wrapper around Angular Material's MatMenuTrigger directive that maintains
 * the same API while keeping the Watt design system abstraction.
 *
 * @example
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
 */
@Directive({
  selector: '[wattMenuTriggerFor]',
  exportAs: 'wattMenuTrigger',
  hostDirectives: [
    {
      directive: MatMenuTrigger,
      inputs: ['matMenuTriggerData: wattMenuTriggerData', 'matMenuTriggerRestoreFocus: wattMenuTriggerRestoreFocus'],
      outputs: ['menuOpened', 'menuClosed']
    }
  ],
  standalone: true
})
export class WattMenuTriggerDirective implements OnInit {
  private readonly matMenuTrigger = inject(MatMenuTrigger);

  @Input() wattMenuTriggerFor!: WattMenuComponent;
  @Input() wattMenuTriggerData: unknown;
  @Input() wattMenuTriggerRestoreFocus = true;

  ngOnInit(): void {
    // Set the MatMenu instance from the WattMenuComponent
    this.matMenuTrigger.menu = this.wattMenuTriggerFor.menu();
  }

  /** Opens the menu */
  openMenu(): void {
    this.matMenuTrigger.openMenu();
  }

  /** Closes the menu */
  closeMenu(): void {
    this.matMenuTrigger.closeMenu();
  }

  /** Toggles the menu between the open and closed states */
  toggleMenu(): void {
    this.matMenuTrigger.toggleMenu();
  }

  /** Whether the menu is open */
  get menuOpen(): boolean {
    return this.matMenuTrigger.menuOpen;
  }
}
