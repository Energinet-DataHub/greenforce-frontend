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
import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthHttp } from '@energinet-datahub/eo/auth/data-access-api';
import { AbsoluteUrlGenerator, eoDashboardRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

// Disabling this check, as no internal state is needed for the store.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EoLandingPageState {}

@Injectable()
export class EoLandingPageStore extends ComponentStore<EoLandingPageState> {
  #absoluteReturnUrl = this.urlGenerator.fromCommands([eoDashboardRoutePath]);

  authenticationUrl$: Observable<string> = this.select(
    this.authHttp.getOidcLogin(this.appBaseHref, this.#absoluteReturnUrl),
    (response) => response.next_url
  );

  constructor(
    private authHttp: AuthHttp,
    private urlGenerator: AbsoluteUrlGenerator,
    @Inject(APP_BASE_HREF) private appBaseHref: string
  ) {
    super({});
  }
}
