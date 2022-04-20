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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-emissions-page-lead-by-example',
  styles: [
    `
      :host {
        display: block;
        background: var(--watt-color-neutral-white);
        padding: var(--watt-space-m);
      }
      img {
        display: block;
        width: 544px; // Magic number by designer
        height: 201px; // Magic number by designer
      }

      h3 {
        color: var(--watt-color-neutral-black);
      }
    `,
  ],
  template: `
    <img class="watt-space-stack-m" src="assets/images/emissions/sonderborg-medals-row.svg" />
    <h3 class="watt-space-stack-m">Sønderborg viser verden vejen</h3>
    <p class="watt-space-stack-m">
      Energisystem skal være CO2-neutral i 2029 i Sønderborg-området Allerede tilbage i 2007 blev den
      ambitiøse vision lagt frem, og Sønderborg gik forrest i den grønne omstilling af energisystemet med ProjectZero.
      I Sønderborg skabes et intelligent og integreret energisystem, hvor data bruges til at sikre,
      at energien udnyttes bedst muligt.
      ProjectZero er allerede kommet langt i den planlagte klimarejse og er snart klar til 2. halvleg.
    </p>
    <p>
      Læs mere om <a href="#" target="_blank">ProjectZero</a>.
    </p>
  `,
})
export class EoEmissionsPageLeadByExampleComponent {}

@NgModule({
  declarations: [EoEmissionsPageLeadByExampleComponent],
  exports: [EoEmissionsPageLeadByExampleComponent]
})
export class EoEmissionsPageLeadByExampleScam {}
