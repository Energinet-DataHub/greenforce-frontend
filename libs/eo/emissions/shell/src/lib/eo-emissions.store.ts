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
// Disabling this check, as no internal state is needed for the store.

import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { EmissionPoint, EoEmissionsService } from './eo-emissions.service';

export interface EoEmissionsState {
  emissions: EmissionPoint[];
  totalEmissions: string;
}

const initialState: EoEmissionsState = {
  emissions: [],
  totalEmissions: '0',
};

@Injectable()
export class EoEmissionsStore extends ComponentStore<EoEmissionsState> {
  emissions$: Observable<EoEmissionsState> = this.select(
    this.emissionsService.getEmissions().pipe(
      tapResponse(
        (response) => response,
        (error) => {
          // We only support the happy path for now
          throw error;
        }
      )
    ),

    (response) => response
  );

  constructor(private emissionsService: EoEmissionsService) {
    super(initialState);
  }
}
