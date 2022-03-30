import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { WattTimeRangeInputComponent } from './watt-time-range-input.component';

@NgModule({
  declarations: [WattTimeRangeInputComponent],
  exports: [WattTimeRangeInputComponent],
  imports: [MatDatepickerModule, MatNativeDateModule],
})
export class WattTimeRangeInputModule {}
