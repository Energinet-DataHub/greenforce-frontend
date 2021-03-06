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
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Intentionally use full product name prefix for the root component
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'energy-origin-app',
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        min-width: 375px; // Magix UX number
        background: var(--watt-color-neutral-grey-100);
      }
    `,
  ],
  template: `<router-outlet></router-outlet>`,
})
export class EnergyOriginAppComponent {}

@NgModule({
  declarations: [EnergyOriginAppComponent],
  imports: [RouterModule],
})
export class EnergyOriginAppScam {}
