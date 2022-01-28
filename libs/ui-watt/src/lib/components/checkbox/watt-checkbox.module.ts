import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { WattCheckboxComponent } from './watt-checkbox.component';

@NgModule({
  declarations: [WattCheckboxComponent],
  exports: [WattCheckboxComponent],
  imports: [MatCheckboxModule, ReactiveFormsModule],
})
export class WattCheckboxModule {}
