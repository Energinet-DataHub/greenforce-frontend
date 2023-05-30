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
import { ComponentStore } from '@ngrx/component-store';
import { EoTransfer, EoTransferService } from './eo-transfers.service';

interface EoTransferState {
  hasLoaded: boolean;
  transfers: EoTransfer[];
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoTransferStore extends ComponentStore<EoTransferState> {
  readonly hasLoaded$ = this.select((state) => state.hasLoaded);
  readonly setHasLoaded = this.updater(
    (state, hasLoaded: boolean): EoTransferState => ({
      ...state,
      hasLoaded: hasLoaded,
    })
  );

  readonly transfers$ = this.select((state) => state.transfers);
  readonly setTransfers = this.updater(
    (state, transfers: EoTransfer[]): EoTransferState => ({ ...state, transfers })
  );

  readonly error$ = this.select((state) => state.error);
  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoTransferState => ({ ...state, error })
  );

  constructor(private service: EoTransferService) {
    super({ hasLoaded: false, transfers: [], error: null });
    this.loadData();
  }

  loadData() {
    this.service.getTransfers().subscribe({
      next: (response) => {
        this.setTransfers(response.result);
        this.setError(null);
        this.setHasLoaded(true);
      },
      error: (error) => {
        const test = [
          {
            status: 'Test1',
            dateFrom: new Date().setDate(new Date().getDate() - 1),
            dateTo: new Date().setDate(new Date().getDate() + 1),
            recipient: 'Test',
          },
          {
            status: 'Test2',
            dateFrom: new Date().setDate(new Date().getDate() - 1),
            dateTo: new Date().getTime(),
            recipient: 'Test',
          },
        ];

        this.setTransfers(test);
        this.setError(error);
        this.setHasLoaded(true);
      },
    });
  }
}
