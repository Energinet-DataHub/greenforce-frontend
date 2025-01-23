import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';

import { isValidMeteringPointId } from './dh-is-valid-metering-point-id';
import { dhMeteringPointIdParam } from './dh-metering-point-id-param';

export const dhCanActivateMeteringPointOverview: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const meteringPointId: string = route.params[dhMeteringPointIdParam];

  return (
    isValidMeteringPointId(meteringPointId) ||
    inject(Router).createUrlTree([
      getPath<BasePaths>('metering-point'),
      getPath<MeteringPointSubPaths>('search'),
    ])
  );
};
