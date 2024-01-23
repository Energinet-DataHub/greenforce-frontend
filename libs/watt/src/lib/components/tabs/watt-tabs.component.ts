import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ViewEncapsulation,
  inject,
  Input,
  HostBinding,
} from '@angular/core';
import { NgFor, NgTemplateOutlet } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { WattTabComponent } from './watt-tab.component';

@Component({
  standalone: true,
  selector: 'watt-tabs',
  styleUrls: ['./watt-tabs.component.scss'],
  templateUrl: './watt-tabs.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgFor, NgTemplateOutlet, MatTabsModule],
})
export class WattTabsComponent implements AfterViewInit {
  @Input() variant!: string;

  @HostBinding('class')
  get hostClass() {
    return this.variant ? `watt-tabs-${this.variant}` : '';
  }

  private readonly cdr = inject(ChangeDetectorRef);

  @ContentChildren(WattTabComponent)
  public readonly tabElements: QueryList<WattTabComponent> = new QueryList<WattTabComponent>();
  activeTabIndex = 0;

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  emitSelectedTabChange(selectedIndex: number) {
    this.activeTabIndex = selectedIndex;
    const currentTab = this.tabElements.find((tab, index) => index === selectedIndex);
    currentTab?.emitChange();
  }

  triggerChange() {
    this.emitSelectedTabChange(this.activeTabIndex);
  }
}
