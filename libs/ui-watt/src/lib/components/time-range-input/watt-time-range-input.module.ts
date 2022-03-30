import { NgModule } from '@angular/core';
import { WattFormFieldModule } from '../form-field/form-field.module';

import { WattTimeRangeInputComponent } from './watt-time-range-input.component';

@NgModule({
  declarations: [WattTimeRangeInputComponent],
  exports: [WattTimeRangeInputComponent],
  imports: [WattFormFieldModule],
})
export class WattTimeRangeInputModule {}
