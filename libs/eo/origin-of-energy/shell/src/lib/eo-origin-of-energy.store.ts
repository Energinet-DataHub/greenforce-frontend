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
