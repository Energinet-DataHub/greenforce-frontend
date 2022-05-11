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
