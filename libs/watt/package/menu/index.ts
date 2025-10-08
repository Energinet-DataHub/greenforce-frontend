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
// Individual exports
export { WattMenuComponent } from './watt-menu.component';
export { WattMenuItemComponent } from './watt-menu-item.component';
export { WattMenuGroupComponent } from './watt-menu-group.component';
export { WattMenuTriggerDirective } from './watt-menu-trigger.directive';

// Import the components for the combined export
import { WattMenuComponent } from './watt-menu.component';
import { WattMenuItemComponent } from './watt-menu-item.component';
import { WattMenuGroupComponent } from './watt-menu-group.component';
import { WattMenuTriggerDirective } from './watt-menu-trigger.directive';

// Combined export for convenience - all menu-related components
export const WATT_MENU = [
  WattMenuComponent,
  WattMenuItemComponent,
  WattMenuGroupComponent,
  WattMenuTriggerDirective,
] as const;
