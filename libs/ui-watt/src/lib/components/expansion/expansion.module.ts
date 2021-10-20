import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WattButtonModule } from '@energinet-datahub/watt';

import { WattExpansionComponent } from './expansion.component';

@NgModule({
  imports: [BrowserAnimationsModule, MatExpansionModule, WattButtonModule],
  declarations: [WattExpansionComponent],
  exports: [WattExpansionComponent],
})
export class WattExpansionModule {}
