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
import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import {
  getPath,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';
import { MeteringPointSubType } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhMoveInComponent } from '@energinet-datahub/dh/metering-point/feature-move-in';
import {
  DhReleaseToggleDirective,
  DhReleaseToggleService,
} from '@energinet-datahub/dh/shared/release-toggle';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { InstallationAddress } from '../types';

@Component({
  selector: 'dh-metering-point-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMenuModule,
    RouterLink,
    TranslocoDirective,

    WattButtonComponent,
    WattIconComponent,
    DhPermissionRequiredDirective,
    DhReleaseToggleDirective,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.overview.actions'">
      @if (maybeShowActionsButton()) {
        <watt-button
          *dhReleaseToggle="'MoveInBrs009'; else elseTmpl"
          variant="secondary"
          [matMenuTriggerFor]="menu"
        >
          {{ t('actionsButton') }}
          <watt-icon name="plus" />
        </watt-button>

        <ng-template #elseTmpl>
          <watt-button
            *dhPermissionRequired="['measurements:manage']"
            variant="secondary"
            [matMenuTriggerFor]="menu"
          >
            {{ t('actionsButton') }}
            <watt-icon name="plus" />
          </watt-button>
        </ng-template>
      }

      <mat-menu #menu="matMenu">
        @if (maybeShowMeasurementsUploadButton()) {
          <button
            *dhPermissionRequired="['measurements:manage']"
            type="button"
            mat-menu-item
            [routerLink]="getMeasurementsUploadLink"
          >
            {{ t('upload') }}
          </button>
        }

        <button
          *dhReleaseToggle="'MoveInBrs009'"
          type="button"
          mat-menu-item
          (click)="startMoveIn()"
        >
          {{ t('moveIn') }}
        </button>
      </mat-menu>
    </ng-container>
  `,
})
export class DhMeteringPointActionsComponent {
  private readonly releaseToggleService = inject(DhReleaseToggleService);
  private readonly modalService = inject(WattModalService);

  isCalculatedMeteringPoint = computed(() => this.subType() === MeteringPointSubType.Calculated);
  getMeasurementsUploadLink = `${getPath<MeteringPointSubPaths>('measurements')}/${getPath<MeasurementsSubPaths>('upload')}`;

  subType = input<MeteringPointSubType | null>();
  installationAddress = input<InstallationAddress | null>();

  maybeShowMeasurementsUploadButton = computed(() => {
    return (
      this.releaseToggleService.isEnabled('PM96-SHAREMEASUREDATA') &&
      !this.isCalculatedMeteringPoint()
    );
  });

  maybeShowActionsButton = computed(() => {
    return (
      this.maybeShowMeasurementsUploadButton() ||
      this.releaseToggleService.isEnabled('MoveInBrs009')
    );
  });

  startMoveIn() {
    this.modalService.open({
      component: DhMoveInComponent,
      data: { installationAddress: this.installationAddress() },
      disableClose: true,
    });
  }
}
