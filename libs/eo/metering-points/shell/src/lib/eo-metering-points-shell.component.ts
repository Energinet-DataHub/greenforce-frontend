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
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoMeteringPointListComponent } from './eo-metering-point-table.component';
import { EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, EoPopupMessageComponent, EoMeteringPointListComponent],
  selector: 'eo-metering-points-shell',
  styles: [``],
  template: `
    <eo-popup-message *ngIf="error$ | async"></eo-popup-message>
    <eo-metering-points-table></eo-metering-points-table>
  `,
})
export class EoMeteringPointsShellComponent {
  error$ = this.meteringPointStore.error$;

  constructor(private meteringPointStore: EoMeteringPointsStore) {}
}
