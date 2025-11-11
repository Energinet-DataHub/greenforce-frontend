//#region License
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
//#endregion
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet/watt/vater';

import { dhMeteringPointTypeParam } from './dh-metering-point-params';

@Component({
  selector: 'dh-create-metering-point',
  imports: [RouterLink, VaterStackComponent, VaterSpacerComponent, WATT_CARD, WattButtonComponent],
  styles: `
    :host {
      display: block;
      padding: var(--watt-space-ml);
    }

    .page-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--watt-space-m);
    }
  `,
  template: `
    <vater-stack direction="row" align="center" gap="s" class="watt-space-stack-m">
      <h3>Opret Forbrug (E17) målepunkt</h3>

      <vater-spacer />

      <watt-button variant="secondary" [routerLink]="['../']">Afbryd</watt-button>
      <watt-button variant="primary">Opret målepunkt</watt-button>
    </vater-stack>

    <div class="page-grid">
      <watt-card>
        <watt-card-title>Detaljer</watt-card-title>

        1
      </watt-card>

      <watt-card>
        <watt-card-title>Addresse</watt-card-title>

        2
      </watt-card>

      <watt-card>
        <watt-card-title>Anlæg</watt-card-title>

        3
      </watt-card>
    </div>
  `,
})
export class DhCreateMeteringPointComponent {
  private readonly mpType =
    inject(ActivatedRoute)?.snapshot.queryParamMap.get(dhMeteringPointTypeParam);
}
