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
import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { WattTabComponent } from './tab/tab.component';

/**
 * Usage:
 * `import { WattTabsModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WattTabsComponent implements AfterContentInit {
  @ContentChildren(WattTabComponent)
  private tabComponents: QueryList<WattTabComponent> = new QueryList<WattTabComponent>();
  tabTemplates: Array<WattTabComponent> = [];

  ngAfterContentInit(): void {
    this.tabTemplates = this.tabComponents.toArray();
  }
}
