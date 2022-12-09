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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';

import { WattTabComponent } from './tab/tab.component';

/**
 * Usage:
 * `import { WattTabsModule } from '@energinet-datahub/watt/tabs';`
 */
@Component({
  selector: 'watt-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WattTabsComponent implements AfterViewInit {
  /**
   * @ignore
   */
  @ContentChildren(WattTabComponent)
  public readonly tabElements: QueryList<WattTabComponent> = new QueryList<WattTabComponent>();
  activeTabIndex = 0;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  emitSelectedTabChange(selectedIndex: number) {
    this.activeTabIndex = selectedIndex;
    const currentTab = this.tabElements.find(
      (tab, index) => index === selectedIndex
    );
    currentTab?.emitChange();
  }

  triggerChange() {
    this.emitSelectedTabChange(this.activeTabIndex);
  }
}
