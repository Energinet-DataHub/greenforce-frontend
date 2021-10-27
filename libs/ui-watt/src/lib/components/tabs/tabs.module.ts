import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattTabComponent } from './tab/tab.component';
import { WattTabsComponent } from './tabs.component';

@NgModule({
  imports: [BrowserAnimationsModule, CommonModule, MatTabsModule],
  declarations: [WattTabsComponent, WattTabComponent],
  exports: [WattTabsComponent, WattTabComponent],
})
export class WattTabsModule {}
