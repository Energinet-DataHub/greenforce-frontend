import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

import { WattTabComponent } from './tab/tab.component';
import { WattTabsComponent } from './tabs.component';

@NgModule({
  imports: [MatTabsModule],
  declarations: [WattTabsComponent, WattTabComponent],
  exports: [WattTabsComponent, WattTabComponent],
})
export class WattTabsModule {}
