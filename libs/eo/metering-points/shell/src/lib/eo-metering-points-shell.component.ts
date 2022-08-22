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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { EoPopupMessageScam } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { LetModule } from '@rx-angular/template';
import { EoMeteringPointListScam } from './eo-metering-point-list.component';
import { EoMeteringPointsStore } from './eo-metering-points.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-metering-points-shell',
  styles: [``],
  template: ` <ng-container *rxLet="error$ as error">
      <eo-popup-message *ngIf="error" [errorMessage]="error">
      </eo-popup-message> </ng-container
    ><eo-metering-points-list></eo-metering-points-list>`,
})
export class EoMeteringPointsShellComponent {
  error$ = this.meteringPointStore.error$;

  constructor(private meteringPointStore: EoMeteringPointsStore) {}
}

@NgModule({
  declarations: [EoMeteringPointsShellComponent],
  exports: [EoMeteringPointsShellComponent],
  imports: [
    LetModule,
    CommonModule,
    EoPopupMessageScam,
    EoMeteringPointListScam,
  ],
})
export class EoMeteringPointsShellScam {}
