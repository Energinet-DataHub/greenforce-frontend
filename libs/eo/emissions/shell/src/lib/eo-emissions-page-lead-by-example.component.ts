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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-emissions-page-lead-by-example',
  styles: [
    `
      :host {
        display: block;
      }

      mat-card {
        background: var(--watt-color-neutral-white);
        img {
          display: block;
          width: 544px; // Magic number by designer
          height: 201px; // Magic number by designer
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <img
        alt="Sonderborg leads the way | EnergyOrigin"
        class="watt-space-stack-m"
        src="assets/images/emissions/sonderborg-medals-row.svg"
      />
      <h3 class="watt-space-stack-m">
        The municipality of Sønderborg aims at CO2 neutrality by 2029
      </h3>
      <p class="watt-space-stack-m">
        In 2007, ProjectZero was established as a public-private initiative.
        The aim of the project was to drive Sønderborg's transition towards carbon neutrality by 2029.
        To meet the ambition, the project focuses on different initiatives including energy efficiency and
        conversion of energy sources into renewables.
        In 2020, ProjectZero had already obtained a 51,80% CO2 reduction in the Sønderborg-area,
        thus the project is fully on track to reach the overall target by 2029.
      </p>
      <p>
        Read more about
        <a href="https://www.projectzero.dk" target="_blank">ProjectZero</a>.
      </p>
    </mat-card>
  `,
})
export class EoEmissionsPageLeadByExampleComponent {}

@NgModule({
  declarations: [EoEmissionsPageLeadByExampleComponent],
  imports: [MatCardModule],
  exports: [EoEmissionsPageLeadByExampleComponent],
})
export class EoEmissionsPageLeadByExampleScam {}
