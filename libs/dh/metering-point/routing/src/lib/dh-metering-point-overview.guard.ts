/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
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
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { isValidMeteringPointId } from '@energinet-datahub/dh/metering-point/domain';

import { dhMeteringPointIdParam } from './dh-metering-point-id-param';
import { dhMeteringPointPath } from './dh-metering-point-path';
import { dhMeteringPointSearchPath } from './dh-metering-point-search-path';

/**
 * Redirects to search metering point page if metering point id is invalid.
 */
@Injectable({
  providedIn: 'root',
})
export class DhMeteringPointOverviewGuard implements CanActivate {
  private searchMeteringPointUrl(id: string): UrlTree {
    const url = `${dhMeteringPointPath}/${dhMeteringPointSearchPath}`;

    return this.router.createUrlTree([url], { queryParams: { q: id } });
  }

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const meteringPointId = route.paramMap.get(dhMeteringPointIdParam) ?? '';

    return isValidMeteringPointId(meteringPointId)
      ? true
      : this.searchMeteringPointUrl(meteringPointId);
  }
}
