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
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhSetUpAccessToMeasurements } from './create/set-up-access-to-measurements';

@Component({
  selector: 'dh-access-to-measurements-tab',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  templateUrl: './access-to-measurements-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterFlexComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    DhPermissionRequiredDirective,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhAccessToMeasurementsTab {
  private readonly modalService = inject(WattModalService);

  actor = input.required<DhActorExtended>();

  setUpAccessToMeasurements(): void {
    this.modalService.open({ component: DhSetUpAccessToMeasurements, data: this.actor() });
  }
}
