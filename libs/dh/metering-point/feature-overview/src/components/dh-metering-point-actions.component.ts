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
import { NgTemplateOutlet } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';
import {
  getPath,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';
import {
  ConnectionState,
  ElectricityMarketMeteringPointType,
  MeteringPointSubType,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhMoveInComponent,
  DhCustomerDataModalComponent,
  DhStartMoveInModalComponent,
} from '@energinet-datahub/dh/metering-point/feature-move-in';
import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/release-toggle';
import { WattModalService } from '@energinet/watt/modal';

import { InstallationAddress } from '../types';

@Component({
  selector: 'dh-metering-point-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMenuModule,
    RouterLink,
    NgTemplateOutlet,
    TranslocoDirective,

    WattButtonComponent,
    WattIconComponent,
    DhPermissionRequiredDirective,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.overview.actions'">
      @if (showActionsButton()) {
        @if (showMeasurementsUploadButton()) {
          <watt-button
            *dhPermissionRequired="['measurements:manage']; else elseTmpl"
            variant="secondary"
            [matMenuTriggerFor]="menu"
          >
            {{ t('actionsButton') }}
            <watt-icon name="moreVertical" />
          </watt-button>
        } @else {
          <ng-content *ngTemplateOutlet="elseTmpl" />
        }

        <ng-template #elseTmpl>
          @if (showMoveInButton()) {
            <watt-button
              *dhPermissionRequired="['metering-point:move-in']"
              variant="secondary"
              [matMenuTriggerFor]="menu"
            >
              {{ t('actionsButton') }}
              <watt-icon name="moreVertical" />
            </watt-button>
          }
        </ng-template>
      }

      <mat-menu #menu="matMenu">
        @if (showMeasurementsUploadButton()) {
          <button
            *dhPermissionRequired="['measurements:manage']"
            type="button"
            mat-menu-item
            [routerLink]="getMeasurementsUploadLink"
          >
            {{ t('upload') }}
          </button>
        }

        @if (showMoveInButton()) {
          <button
            *dhPermissionRequired="['metering-point:move-in']"
            type="button"
            mat-menu-item
            (click)="startMoveIn()"
          >
            {{ t('moveIn') }}
          </button>
          <!-- TODO: MASEP to be removed-->
          <button
            *dhPermissionRequired="['metering-point:move-in']"
            type="button"
            mat-menu-item
            (click)="startSecondMoveIn()"
          >
            Opdatér kundestamdata
          </button>
        }
      </mat-menu>
    </ng-container>
  `,
})
export class DhMeteringPointActionsComponent {
  private readonly releaseToggleService = inject(DhReleaseToggleService);
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);

  isCalculatedMeteringPoint = computed(() => this.subType() === MeteringPointSubType.Calculated);
  getMeasurementsUploadLink = `${getPath<MeteringPointSubPaths>('measurements')}/${getPath<MeasurementsSubPaths>('upload')}`;

  type = input<ElectricityMarketMeteringPointType | null>();
  subType = input<MeteringPointSubType | null>();
  connectionState = input<ConnectionState | null>();
  installationAddress = input<InstallationAddress | null>();

  private readonly hasGridAccessProviderRole = toSignal(
    this.permissionService.hasMarketRole(EicFunction.GridAccessProvider),
    { initialValue: false }
  );

  showMeasurementsUploadButton = computed(() => {
    return (
      this.releaseToggleService.isEnabled('PM96-SHAREMEASUREDATA') &&
      !this.isCalculatedMeteringPoint() &&
      this.hasGridAccessProviderRole()
    );
  });

  showMoveInButton = computed(() => {
    return (
      this.releaseToggleService.isEnabled('MoveInBrs009') &&
      this.connectionState() === ConnectionState.Connected &&
      (this.type() === ElectricityMarketMeteringPointType.Consumption ||
        this.type() === ElectricityMarketMeteringPointType.Production)
    );
  });

  showActionsButton = computed(() => {
    return this.showMeasurementsUploadButton() || this.showMoveInButton();
  });

  startMoveIn() {
    this.modalService.open({
      component: DhStartMoveInModalComponent,
      data: { installationAddress: this.installationAddress() },
      disableClose: true,
    });
  }

  // TODO: MASEP To be removed
  startSecondMoveIn() {
    this.modalService.open({
      component: DhCustomerDataModalComponent,
      data: { installationAddress: this.installationAddress() },
      disableClose: true,
    });
  }
}
