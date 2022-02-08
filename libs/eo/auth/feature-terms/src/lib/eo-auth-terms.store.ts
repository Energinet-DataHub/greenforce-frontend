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
import { Router } from '@angular/router';
import { ComponentStore, tapResponse  } from '@ngrx/component-store';
import {
  Observable,
  exhaustMap,
  mergeMap,
  of,
  throwError
} from 'rxjs';
import { AuthHttp } from '@energinet-datahub/ett/auth/data-access-api';

// Disabling this check, as no internal state is needed for the store.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EoAuthTermsState {}

@Injectable()
export class EoAuthTermsStore extends ComponentStore<EoAuthTermsState> {
  getTerms$: Observable<string> = this.select(this.authHttp.getTerms(), (response) => response);

  constructor(private authHttp: AuthHttp, private router: Router) {
    super({});
  }

  /*
  onLogOut = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() =>
        this.authHttp.postLogout().pipe(
          mergeMap((response) =>
            response.success === true
              ? of(undefined)
              : throwError(() => new Error('Log out failed'))
          ),
          tapResponse(
            () => this.router.navigateByUrl(eoLandingPageRelativeUrl),
            (error) => {
              // We only support the happy path for now
              throw error;
            }
          )
        )
      )
    )
  );
  */

  onAcceptTerms = this.effect<void>((origin$) =>
    origin$.pipe(
      exhaustMap(() =>
        this.authHttp.acceptTerms().pipe(
          mergeMap((response) =>
            response.success === true
              ? of(undefined) // @todo: Update the success response handling below -> Remove 'undefined' if we actually get a response object(?)
              : throwError(() => new Error('Log out failed'))
          ),
          tapResponse(
            () => this.router.navigateByUrl(''), // @todo: Import path to the dashboard here
            (error) => {
              // We only support the happy path for now
              throw error;
            }
          )
        )
      )
    )
  );
}
