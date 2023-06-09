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
import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';
import { testData } from './test-data';

interface EoTransfersState {
  hasLoaded: boolean;
  transfers: EoListedTransfer[];
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoTransfersStore extends ComponentStore<EoTransfersState> {
  readonly hasLoaded$ = this.select((state) => state.hasLoaded);
  readonly transfers$ = this.select((state) => state.transfers);
  readonly error$ = this.select((state) => state.error);

  private readonly setHasLoaded = this.updater(
    (state, hasLoaded: boolean): EoTransfersState => ({ ...state, hasLoaded: hasLoaded })
  );
  private readonly setTransfers = this.updater(
    (state, transfers: EoListedTransfer[]): EoTransfersState => ({ ...state, transfers })
  );
  private readonly addSingleTransfer = this.updater(
    (state, transfer: EoListedTransfer): EoTransfersState => ({
      ...state,
      transfers: [transfer].concat(state.transfers),
    })
  );
  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoTransfersState => ({ ...state, error })
  );

  constructor(private service: EoTransfersService) {
    super({ hasLoaded: false, transfers: [], error: null });
    this.loadData();
  }

  addTransfer(transfer: EoListedTransfer) {
    this.addSingleTransfer(transfer);
  }

  loadData() {
    this.service.getTransfers().subscribe({
      next: (response) => {
        this.setTransfers(response);
        this.setError(null);
        this.setHasLoaded(true);
      },
      error: (error) => {
        this.setTransfers(testData);
        this.setError(error);
        this.setHasLoaded(true);
      },
    });
  }
}
