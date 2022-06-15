import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { take } from 'rxjs';
import { EoOriginOfEnergyService } from './eo-origin-of-energy.service';

interface EoOriginOfEnergy {
  /** Unix timestamp */
  dateFrom: number;
  /** Unix timestamp */
  dateTo: number;
  /** Share of renewable energy in decimal form */
  renewable: number;
  /** Share of renewable energy shares in decimal form */
  ratios: {
    wood: number;
    waste: number;
    straw: number;
    oil: number;
    naturalGas: number;
    coal: number;
    bioGas: number;
    solar: number;
    windOnshore: number;
    windOffshore: number;
  };
}

interface EoOriginOfEnergyState {
  loadingDone: boolean;
  energySources: EoOriginOfEnergy;
}

@Injectable()
export class EoOriginOfEnergyStore extends ComponentStore<EoOriginOfEnergyState> {
  constructor(private service: EoOriginOfEnergyService) {
    super({
      loadingDone: false,
      energySources: {
        dateFrom: 0,
        dateTo: 0,
        renewable: 0,
        ratios: {
          wood: 0,
          waste: 0,
          straw: 0,
          oil: 0,
          naturalGas: 0,
          coal: 0,
          bioGas: 0,
          solar: 0,
          windOnshore: 0,
          windOffshore: 0,
        },
      },
    });

    this.loadEnergySourcesDate();
  }

  // *********** Selectors *********** //
  readonly loadingDone$ = this.select((state) => state.loadingDone);
  readonly renewable$ = this.select((state) => state.energySources.renewable);
  readonly ratios$ = this.select((state) => state.energySources.ratios);

  // *********** Updaters *********** //
  readonly setLoadingDone = this.updater(
    (state, value: boolean): EoOriginOfEnergyState => ({
      ...state,
      loadingDone: value,
    })
  );

  readonly setEnergySources = this.updater(
    (state, value: EoOriginOfEnergy): EoOriginOfEnergyState => ({
      ...state,
      energySources: value,
    })
  );

  loadEnergySourcesDate() {
    this.service
      .getSources()
      .pipe(take(1))
      .subscribe((response) => {
        this.setEnergySources(response.energySources[0]);
        this.setLoadingDone(true);
      });
  }
}
