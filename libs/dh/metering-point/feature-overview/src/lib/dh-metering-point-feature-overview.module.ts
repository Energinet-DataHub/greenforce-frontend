import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DhMeteringPointFeatureChildOverviewModule } from '@energinet-datahub/dh/metering-point/feature-child-overview';

import {
  DhMeteringPointOverviewComponent,
  DhMeteringPointOverviewScam,
} from './dh-metering-point-overview.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointOverviewGuard } from './routing/dh-metering-point-overview.guard';

const routes: Routes = [
  {
    path: `:${dhMeteringPointIdParam}`,
    canActivate: [DhMeteringPointOverviewGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DhMeteringPointOverviewComponent,
      },
      {
        path: '',
        loadChildren: () => DhMeteringPointFeatureChildOverviewModule,
      },
    ],
  },
];

@NgModule({
  imports: [DhMeteringPointOverviewScam, RouterModule.forChild(routes)],
})
export class DhMeteringPointFeatureOverviewModule {}
