import { NgModule } from '@angular/core';
import { WattModule } from '@energinet/watt';

import { PageComponent } from './page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [WattModule],
})
export class PageModule {}
