import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { take } from 'rxjs';
import { EoEmissionsService } from './eo-emissions.service';

interface EoEmissions {
  /** Unix timestamp */
  dateFrom: number;
  /** Unix timestamp */
  dateTo: number;
  /** SI value of the total emissions for the selected dates */
  total: { unit: string; value: number };
  /** SI value of the relative emissions for the selected dates */
  relative: { unit: string; value: number };
}

interface EoEmissionsState {
  loadingDone: boolean;
  emissions: EoEmissions;
}

@Injectable()
export class EoEmissionsStore extends ComponentStore<EoEmissionsState> {
  constructor(private service: EoEmissionsService) {
    super({
      loadingDone: false,
      emissions: {
        dateFrom: 0,
        dateTo: 0,
        total: { unit: '', value: 0 },
        relative: { unit: '', value: 0 },
      },
    });

    this.loadEmissionsDate();
  }

  // *********** Selectors *********** //
  readonly total$ = this.select((state) => state.emissions.total);
  readonly relative$ = this.select((state) => state.emissions.relative);
  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly emissions$ = this.select((state) => state.emissions);

  // *********** Updaters *********** //
  readonly setLoadingDone = this.updater(
    (state, value: boolean): EoEmissionsState => ({
      ...state,
      loadingDone: value,
    })
  );

  readonly setEmissions = this.updater(
    (state, value: EoEmissions): EoEmissionsState => ({
      ...state,
      emissions: value,
    })
  );

  loadEmissionsDate() {
    this.service
      .getEmissions()
      .pipe(take(1))
      .subscribe((response) => {
        this.setEmissions(response.emissions[0]);
        this.setLoadingDone(true);
      });
  }
}
