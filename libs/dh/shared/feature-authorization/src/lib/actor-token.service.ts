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
import {
  MarketParticipantUserHttp,
  TokenHttp,
} from '@energinet-datahub/dh/shared/domain';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActorTokenService {
  private _internalToken = '';
  private _externalToken = '';

  constructor(
    private marketParticipantUserHttp: MarketParticipantUserHttp,
    private tokenHttp: TokenHttp
  ) {}

  public acquireToken = (externalToken: string): Observable<string> => {
    if (this._externalToken !== externalToken) {
      this._internalToken = '';
    }

    this._externalToken = externalToken;

    if (this._internalToken) {
      return of(this._internalToken);
    }

    return this.marketParticipantUserHttp
      .v1MarketParticipantUserGet(externalToken)
      .pipe(
        switchMap((r) => {
          return this.tokenHttp
            .v1TokenPost({
              externalActorId: r.externalActorIds[0],
              externalToken: externalToken,
            })
            .pipe(
              tap((r) => (this._internalToken = r.token)),
              map((r) => r.token)
            );
        })
      );
  };
}
