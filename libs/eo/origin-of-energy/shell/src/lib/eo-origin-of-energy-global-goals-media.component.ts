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
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'eo-origin-of-energy-global-goals-media',
  template: ` <div class="global-goals-box">
    <img
      src="/assets/images/origin-of-energy/un-global-goal-7.2.svg"
      alt="UN Global goal 7.2"
      style="height: 128px;"
    />
    <p class="watt-space-inset-m">
      <strong>Global goals 7.2</strong><br />
      increase the share of renewable energy globally [United Nations]
    </p>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }

      .global-goals-box {
        display: flex;
        border: 1px solid var(--watt-color-state-warning);

        p {
          padding-right: var(--watt-space-s);
        }
      }
    `,
  ],
})
export class EoOriginOfEnergyGlobalGoalsMediaComponent {}
