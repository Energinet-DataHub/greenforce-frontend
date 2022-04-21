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
  selector: 'eo-emissions-page-info',
  styles: [
    `
      :host {
        display: block;
      }
      mat-card {
        background: var(--watt-color-state-warning-light);
        h3 {
          font-weight: 600; // Magic number by designer
        }
        h1 {
          color: var(--watt-color-neutral-black);
        }

      .coming-soon-overlay {
        background-color: rgba(196, 196, 196, 0.90);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: var(--watt-space-xs);

        &::before {
           content: 'Coming soon';
           display: flex;
           justify-content: center;
           align-items: center;
           height: 100%;
           color: var(--watt-color-state-danger);
           font-weight: bold;
           font-size: 40px;
         }
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <h3>Your emissions in 2021</h3>
      <h1>1.198 kg CO<sub>2</sub></h1>
      <div class="coming-soon-overlay"></div>
    </mat-card>
  `,
})
export class EoEmissionsPageInfoComponent {}

@NgModule({
  declarations: [EoEmissionsPageInfoComponent],
  imports: [MatCardModule],
  exports: [EoEmissionsPageInfoComponent],
})
export class EoEmissionsPageInfoScam {}
