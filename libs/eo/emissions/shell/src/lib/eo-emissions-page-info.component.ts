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
        p {
          font-weight: 600; // Magic number by designer
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <p>Your emissions in 2021</p>
      <h1>1.198 kg co2</h1>
    </mat-card>
  `,
})
export class EoEmissionsPageInfoComponent {}

@NgModule({
  declarations: [EoEmissionsPageInfoComponent],
  imports: [MatCardModule],
  exports: [EoEmissionsPageInfoComponent]
})
export class EoEmissionsPageInfoScam {}
