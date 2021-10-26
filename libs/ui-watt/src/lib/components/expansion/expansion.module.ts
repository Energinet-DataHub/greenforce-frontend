import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { WattButtonModule } from '../button/watt-button.module';

import { WattExpansionComponent } from './expansion.component';

@NgModule({
  imports: [MatExpansionModule, WattButtonModule],
  declarations: [WattExpansionComponent],
  exports: [WattExpansionComponent],
})
export class WattExpansionModule {}
