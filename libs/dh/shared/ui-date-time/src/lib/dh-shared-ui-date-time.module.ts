import { NgModule } from '@angular/core';

import { DhDatePipe } from './dh-date-time.pipe';

@NgModule({
  declarations: [DhDatePipe],
  exports: [DhDatePipe],
})
export class DhSharedUiDateTimeModule {}
