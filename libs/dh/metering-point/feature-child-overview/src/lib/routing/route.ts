import { Route } from '@angular/router';

import { DhMeteringPointChildOverviewComponent } from '../dh-metering-point-child-overview.component';

export const childMeteringPointRoute: Route = {
  path: 'child/:child-id',
  component: DhMeteringPointChildOverviewComponent,
};
