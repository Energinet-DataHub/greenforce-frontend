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
import { EoMeteringPointListScam } from './eo-metering-point-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-metering-points-shell',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `<eo-metering-points-list></eo-metering-points-list>`,
})
export class EoMeteringPointsShellComponent {}

@NgModule({
  declarations: [EoMeteringPointsShellComponent],
  exports: [EoMeteringPointsShellComponent],
  imports: [EoMeteringPointListScam],
})
export class EoMeteringPointsShellScam {}
