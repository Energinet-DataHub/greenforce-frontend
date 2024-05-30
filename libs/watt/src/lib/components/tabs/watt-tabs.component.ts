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
  AfterViewInit,
  ViewEncapsulation,
  inject,
  HostBinding,
  contentChild,
  viewChild,
  input,
  contentChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import { WattTabComponent } from './watt-tab.component';
import { WattTabsActionComponent } from './watt-tabs-action.component';

@Component({
  standalone: true,
  selector: 'watt-tabs',
  styleUrls: ['./watt-tabs.component.scss'],
  templateUrl: './watt-tabs.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgTemplateOutlet, MatTabsModule],
})
export class WattTabsComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  variant = input<string>();

  @HostBinding('class')
  get hostClass() {
    return this.variant() ? `watt-tabs-${this.variant()}` : '';
  }

  tabElements = contentChildren(WattTabComponent);
  activeTabIndex = 0;

  tabGroup = viewChild.required(MatTabGroup);

  actionsTab = contentChild(WattTabsActionComponent);

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  emitSelectedTabChange(selectedIndex: number) {
    this.activeTabIndex = selectedIndex;
    const currentTab = this.tabElements().find((tab, index) => index === selectedIndex);
    currentTab?.emitChange();
  }

  setSelectedIndex(index: number) {
    this.tabGroup().selectedIndex = index;
  }

  triggerChange() {
    this.emitSelectedTabChange(this.activeTabIndex);
  }
}
