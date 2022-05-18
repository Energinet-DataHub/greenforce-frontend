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
import { Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'eo-origin-of-energy-renewable-energy',
  template: `<mat-card>
    <p class="watt-space-stack-m"><strong>Renewable energy</strong></p>
    <img
      class="ministry-logo watt-space-stack-m"
      src="/assets/images/origin-of-energy/danish-ministry-of-climate-energy-and-utilities.svg"
      alt="Danish Ministry of Climate, Energy and Utilities logo"
    />
    <p class="watt-space-stack-m">
      Renewable energy is a general term for bio-energy, onshore and offshore
      wind power, solar energy, geothermal energy as well as other technologies
      that differ from coal and other fossil fuels by being CO2 neutral. The use
      of sustainable energy sources contributes to the reduction of our
      greenhouse gas emissions and making Denmark independent of fossil energy.
    </p>
    <p>
      Read more on the home page:<br />
      <a
        target="_blank"
        href="https://ens.dk/en/our-responsibilities/energy-climate-politics/greenhouse-gasses"
      >
        Danish Ministry of Climate, Energy and Utilities
      </a>
    </p>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .ministry-logo {
        width: 100%; /* Magic UX image size*/
      }
    `,
  ],
})
export class EoOriginOfEnergyRenewableEnergyComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyRenewableEnergyComponent],
  exports: [EoOriginOfEnergyRenewableEnergyComponent],
  imports: [MatCardModule],
})
export class EoOriginOfEnergyRenewableEnergyScam {}
