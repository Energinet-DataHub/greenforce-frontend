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
 import { ComponentStore, tapResponse } from '@ngrx/component-store';
 import { filter, map, Observable, switchMap, tap } from 'rxjs';
 import { CommonModule } from '@angular/common';
 import { MeteringPointCimDto, MeteringPointHttp } from '@energinet-datahub/dh/shared/data-access-api';
 import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

interface SearchState {
  readonly searchResult?: [];
  readonly searchingState: SearchingState;
}

export const enum SearchingState {
  INIT = 'INIT',
  SEARCHING = 'SEARCHING',
  DONE = 'DONE',
}

const initialState: SearchState = {
  searchResult: [],
  searchingState: SearchingState.INIT,
};

@Injectable()
export class DhMessageArchiveDataAccessApiModule extends ComponentStore<SearchState> {
  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }
}
