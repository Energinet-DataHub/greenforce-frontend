//#region License
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
//#endregion
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DhPageLeaveRedirectService {
  private readonly activatedRoute = inject(ActivatedRoute);

  getRedirectUrl(): string | null {
    let maybeRedirectUrl: string | undefined;
    let route: ActivatedRouteSnapshot | undefined = this.activatedRoute.snapshot.root;

    while (route !== undefined) {
      const pageLeaveRedirectUrl = route.data['pageLeaveRedirectUrl'];

      if (typeof pageLeaveRedirectUrl === 'string') {
        maybeRedirectUrl = pageLeaveRedirectUrl;
      }

      route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
    }

    return maybeRedirectUrl ?? null;
  }
}
