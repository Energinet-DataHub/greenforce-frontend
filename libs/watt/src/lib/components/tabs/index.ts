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
import { WattLinkTabComponent } from './watt-link-tab.component';
import { WattLinkTabsComponent } from './watt-link-tabs.component';

import { WattTabComponent } from './watt-tab.component';
import { WattTabsActionComponent } from './watt-tabs-action.component';
import { WattTabsComponent } from './watt-tabs.component';

export { WattTabComponent } from './watt-tab.component';
export { WattTabsActionComponent } from './watt-tabs-action.component';
export { WattTabsComponent } from './watt-tabs.component';

export { WattLinkTabComponent } from './watt-link-tab.component';
export { WattLinkTabsComponent } from './watt-link-tabs.component';

export const WATT_TABS = [WattTabsComponent, WattTabComponent, WattTabsActionComponent];
export const WATT_LINK_TABS = [WattLinkTabsComponent, WattLinkTabComponent];
