import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DhMeteringPointChildOverviewScam } from './dh-metering-point-child-overview.component';
import { childMeteringPointRoute } from './routing/route';

@NgModule({
  imports: [
    DhMeteringPointChildOverviewScam,
    RouterModule.forChild([childMeteringPointRoute]),
  ],
})
export class DhMeteringPointFeatureChildOverviewModule {}
