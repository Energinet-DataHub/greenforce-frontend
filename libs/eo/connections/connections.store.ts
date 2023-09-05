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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';

import { EoConnection, EoConnectionsService } from './connections.service';

interface EoConnectionsState {
  connections: EoConnection[] | null;
  loadingConnections: boolean;
  loadingConnectionsError: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoConnectionsStore extends ComponentStore<EoConnectionsState> {
  readonly connections$ = this.select((state) => state.connections);
  readonly loadingConnections$ = this.select((state) => state.loadingConnections);
  readonly loadingConnectionsError$ = this.select((state) => state.loadingConnectionsError);

  readonly getConnections = this.effect(() => {
    this.patchState({ loadingConnections: true, loadingConnectionsError: null });

    return this.service.getConnections().pipe(
      tapResponse(
        (response) => {
          this.patchState({ connections: response.connections, loadingConnections: false, loadingConnectionsError: null });
        },
        (error: HttpErrorResponse) => {
          this.patchState({ connections: null, loadingConnections: false, loadingConnectionsError: error  });
        }
      )
    );
  });

  constructor(private service: EoConnectionsService) {
    super({
      connections: null,
      loadingConnections: false,
      loadingConnectionsError: null
    });
  }
}
