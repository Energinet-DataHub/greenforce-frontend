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
import { Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatMenuModule } from '@angular/material/menu';

import { WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

import { DhMeteringPointsMasterDataUploaderComponent } from './file-uploader/dh-metering-points-master-data-uploader.component';

@Component({
  selector: 'dh-metering-points',
  imports: [
    MatMenuModule,
    TranslocoPipe,

    WATT_TABLE,
    WattButtonComponent,
    DhFeatureFlagDirective,
    DhPermissionRequiredDirective,
    DhMeteringPointsMasterDataUploaderComponent,
  ],
  template: `
    <ng-container *dhFeatureFlag="'metering-points-master-data-upload'">
      <watt-button
        *dhPermissionRequired="['fas']"
        variant="icon"
        icon="moreVertical"
        [matMenuTriggerFor]="menu"
      />

      <dh-metering-points-master-data-uploader #uploader />

      <mat-menu #menu="matMenu">
        <button type="button" mat-menu-item (click)="uploader.selectFile()">
          {{ 'electricityMarket.table.uploadButton' | transloco }}
        </button>
      </mat-menu>
    </ng-container>
  `,
})
export class DhMeteringPointsComponent {}
