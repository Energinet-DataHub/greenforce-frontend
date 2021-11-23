import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  DhMeteringPointChildOverviewComponent,
  DhMeteringPointChildOverviewScam,
} from './dh-metering-point-child-overview.component';

const routes: Routes = [
  {
    path: 'child/:child-id',
    component: DhMeteringPointChildOverviewComponent,
  },
];

@NgModule({
  imports: [DhMeteringPointChildOverviewScam, RouterModule.forChild(routes)],
})
export class DhMeteringPointFeatureChildOverviewModule {}
