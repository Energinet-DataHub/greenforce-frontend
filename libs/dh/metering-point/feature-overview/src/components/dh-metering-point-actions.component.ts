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
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MENU } from '@energinet/watt/menu';
import { WattModalService } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';

import {
  getPath,
  MeasurementsSubPaths,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/routing';

import {
  EicFunction,
  ConnectionState,
  MeteringPointSubType,
  ElectricityMarketMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  PermissionService,
  DhPermissionRequiredDirective,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/release-toggle';

import { DhMoveInComponent } from '@energinet-datahub/dh/metering-point/feature-move-in';
import { DhMeteringPointCreateChargeLink } from '@energinet-datahub/dh/metering-point/feature-chargelink';

import { InstallationAddress } from '../types';
import { DhGetMeteringPointForManualCorrectionComponent } from './manual-correction/dh-get-metering-point-for-manual-correction.component';
import { DhSimulateMeteringPointManualCorrectionComponent } from './manual-correction/dh-simulate-metering-point-manual-correction.component';
import { DhExecuteMeteringPointManualCorrectionComponent } from './manual-correction/dh-execute-metering-point-manual-correction.component';

@Component({
  selector: 'dh-metering-point-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgTemplateOutlet,
    TranslocoDirective,
    WattButtonComponent,
    WattIconComponent,
    DhPermissionRequiredDirective,
    WATT_MENU,
    DhGetMeteringPointForManualCorrectionComponent,
    DhSimulateMeteringPointManualCorrectionComponent,
    DhExecuteMeteringPointManualCorrectionComponent,
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
            [wattMenuTriggerFor]="menu"
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
              [wattMenuTriggerFor]="menu"
            >
              {{ t('actionsButton') }}
              <watt-icon name="moreVertical" />
            </watt-button>
          }
        </ng-template>
      }

      <watt-menu #menu>
        @if (showMeasurementsUploadButton()) {
          <watt-menu-item
            *dhPermissionRequired="['measurements:manage']"
            [routerLink]="getMeasurementsUploadLink"
          >
            {{ t('upload') }}
          </watt-menu-item>
        }

        @if (showMoveInButton()) {
          <watt-menu-item
            *dhPermissionRequired="['metering-point:move-in']"
            (click)="startMoveIn()"
          >
            {{ t('moveIn') }}
          </watt-menu-item>
        }

        @if (showCreateChargeLinkButton()) {
          <watt-menu-item
            *dhPermissionRequired="['metering-point:prices-manage']"
            (click)="createLink()"
          >
            {{ t('createChargeLink') }}
          </watt-menu-item>
        }
        @if (showManualCorrectionButtons()) {
          <dh-get-metering-point-for-manual-correction [meteringPointId]="meteringPointId()" />
          <dh-simulate-metering-point-manual-correction [meteringPointId]="meteringPointId()" />
          <dh-execute-metering-point-manual-correction [meteringPointId]="meteringPointId()" />
        }
      </watt-menu>
    </ng-container>
  `,
})
export class DhMeteringPointActionsComponent {
  private readonly releaseToggleService = inject(DhReleaseToggleService);
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);

  isCalculatedMeteringPoint = computed(() => this.subType() === MeteringPointSubType.Calculated);
  getMeasurementsUploadLink = `${getPath<MeteringPointSubPaths>('measurements')}/${getPath<MeasurementsSubPaths>('upload')}`;

  meteringPointId = input.required<string>();
  type = input<ElectricityMarketMeteringPointType | null>();
  subType = input<MeteringPointSubType | null>();
  connectionState = input<ConnectionState | null>();
  installationAddress = input<InstallationAddress | null>();

  private readonly hasDataHubAdministratorRole = toSignal(
    this.permissionService.hasMarketRole(EicFunction.DataHubAdministrator),
    { initialValue: false }
  );

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

  showCreateChargeLinkButton = computed(() => {
    return this.releaseToggleService.isEnabled('PM60-CHARGE-LINKS-UI');
  });

  showManualCorrectionButtons = computed(() => {
    return this.hasDataHubAdministratorRole();
  });

  showActionsButton = computed(() => {
    return (
      this.showMeasurementsUploadButton() ||
      this.showMoveInButton() ||
      this.showCreateChargeLinkButton() ||
      this.showManualCorrectionButtons()
    );
  });

  startMoveIn() {
    this.modalService.open({
      component: DhMoveInComponent,
      data: { installationAddress: this.installationAddress() },
      disableClose: true,
    });
  }

  createLink() {
    this.modalService.open({
      component: DhMeteringPointCreateChargeLink,
      disableClose: true,
    });
  }
}
