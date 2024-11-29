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
