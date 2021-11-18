/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { isValidGsrnNumber } from '@energinet-datahub/dh/metering-point/domain';

import { dhGsrnNumberParam } from './dh-gsrn-number-param';
import { dhMeteringPointPath } from './dh-metering-point-path';

/**
 * Redirects to search metering point page if GSRN number is invalid.
 */
@Injectable({
  providedIn: 'root',
})
export class DhMeteringPointOverviewGuard implements CanActivate {
  private searchMeteringPointUrl(): UrlTree {
    const url = `${dhMeteringPointPath}/search`;

    return this.router.createUrlTree([url]);
  }

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const gsrnNumber = route.paramMap.get(dhGsrnNumberParam) ?? '';

    return isValidGsrnNumber(gsrnNumber) ? true : this.searchMeteringPointUrl();
  }
}
