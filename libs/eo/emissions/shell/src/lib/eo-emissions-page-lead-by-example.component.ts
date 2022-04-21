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

        h3 {
          color: var(--watt-color-neutral-black);
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <img
        class="watt-space-stack-m"
        src="assets/images/emissions/sonderborg-medals-row.svg"
      />
      <h3 class="watt-space-stack-m">
        Sønderborg aims to create a CO2-neutral growth area by 2029
      </h3>
      <p class="watt-space-stack-m">
        With a public-private partnership, ProjectZero was in 2007 created to
        drive Sønderborg’s transition to a ZEROcarbon community by 2029. To meet
        the ambition, the project focuses on different initiatives including
        energy efficiency and conversion of energy sources into renewables.
        ProjectZero is already far along the climate journey, and by 2020 the
        CO2-emission was reduced by 51,80% within the Sønderborg-area.
      </p>
      <p>
        Læs mere om
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
