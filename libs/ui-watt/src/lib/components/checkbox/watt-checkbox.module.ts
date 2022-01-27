import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { WattCheckboxComponent } from './watt-checkbox.component';

@NgModule({
  declarations: [WattCheckboxComponent],
  exports: [WattCheckboxComponent],
  imports: [MatCheckboxModule],
})
export class WattCheckboxModule {}
