import { NgModule } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { WattSpinnerComponent } from './spinner.component';

@NgModule({
  imports: [MatProgressSpinnerModule],
  declarations: [WattSpinnerComponent],
  exports: [WattSpinnerComponent],
})
export class WattSpinnerModule {}
