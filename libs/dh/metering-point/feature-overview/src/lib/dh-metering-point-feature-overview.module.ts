import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DhMeteringPointOverviewScam } from './dh-metering-point-overview.component';
import { meteringPointRoute } from './routing/route';

@NgModule({
  imports: [
    DhMeteringPointOverviewScam,
    RouterModule.forChild([meteringPointRoute]),
  ],
})
export class DhMeteringPointFeatureOverviewModule {}
