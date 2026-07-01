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
} from '@energinet-datahub/dh/core/configuration-routing';

import {
  EicFunction,
  ElectricityMarketViewConnectionState,
  ElectricityMarketViewMeteringPointSubType,
  ElectricityMarketMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/util-release-toggle';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { DhStartMoveInComponent } from '@energinet-datahub/dh/metering-point/feature-move-in';
import { DhEndOfSupplyComponent } from '@energinet-datahub/dh/metering-point/feature-end-of-supply';
import { DhChangeOfSupplierComponent } from '@energinet-datahub/dh/metering-point/feature-change-of-supplier';
import { DhServiceRequestModal } from '@energinet-datahub/dh/metering-point/feature-process-overview';
import { InstallationAddress } from '@energinet-datahub/dh/metering-point/shared/domain';

import { DhConnectionStateManageComponent } from './connection-state-manage/connection-state-manage';
import { DhGetMeteringPointForManualCorrectionComponent } from './manual-correction/dh-get-metering-point-for-manual-correction.component';
import { DhExecuteMeteringPointManualCorrectionComponent } from './manual-correction/dh-execute-metering-point-manual-correction.component';
import { DhSimulateMeteringPointManualCorrectionComponent } from './manual-correction/dh-simulate-metering-point-manual-correction.component';

@Component({
  selector: 'dh-metering-point-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslocoDirective,

    WattButtonComponent,
    WattIconComponent,
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
        <watt-button variant="secondary" [wattMenuTriggerFor]="menu">
          {{ t('actionsButton') }}
          <watt-icon name="moreVertical" />
        </watt-button>
      }

      <watt-menu #menu>
        @if (showMeasurementsUploadButton()) {
          <watt-menu-item [routerLink]="getMeasurementsUploadLink">
            {{ t('upload') }}
          </watt-menu-item>
        }

        @if (showMoveInButton()) {
          <watt-menu-item (click)="startMoveIn()">
            {{ t('moveIn') }}
          </watt-menu-item>
        }

        @if (isEnergySupplierResponsible()) {
          <watt-menu-item [routerLink]="getUpdateCustomerDetailsLink">
            {{ t('updateCustomerData') }}
          </watt-menu-item>
        }

        @if (showCreateChargeLinkButton()) {
          <watt-menu-item
            [routerLink]="[createChargeLinkLink, { outlets: { create: ['create'] } }]"
          >
            {{ t('createChargeLink') }}
          </watt-menu-item>
        }

        @if (showManualCorrectionButtons()) {
          <dh-get-metering-point-for-manual-correction [meteringPointId]="meteringPointId()" />
          <dh-simulate-metering-point-manual-correction [meteringPointId]="meteringPointId()" />
          <dh-execute-metering-point-manual-correction [meteringPointId]="meteringPointId()" />
        }

        @if (showEndOfSupplyButton()) {
          <watt-menu-item (click)="startEndOfSupply()">
            {{ t('endOfSupply') }}
          </watt-menu-item>
        }

        @if (showServiceRequestButton()) {
          <watt-menu-item (click)="startServiceRequest()">
            {{ t('serviceRequest') }}
          </watt-menu-item>
        }

        @if (showChangeOfSupplierButton()) {
          <watt-menu-item (click)="startChangeOfSupplier()">
            {{ t('changeOfSupplier') }}
          </watt-menu-item>
        }

        @if (showConnectionStateManageButton()) {
          <watt-menu-item (click)="connectionStateManage()">
            {{ t('changeConnectionStatus') }}
          </watt-menu-item>
        }

        @if (showHistoricalCorrectionButton()) {
          <watt-menu-item [routerLink]="getHistoricalCorrectionLink">
            {{ t('historicalCorrection') }}
          </watt-menu-item>
        }
      </watt-menu>
    </ng-container>
  `,
})
export class DhMeteringPointActionsComponent {
  private readonly releaseToggleService = inject(DhReleaseToggleService);
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);
  private readonly actor = inject(DhActorStorage);

  isCalculatedMeteringPoint = computed(
    () => this.subType() === ElectricityMarketViewMeteringPointSubType.Calculated
  );
  getMeasurementsUploadLink = `${getPath<MeteringPointSubPaths>('measurements')}/${getPath<MeasurementsSubPaths>('upload')}`;
  getUpdateCustomerDetailsLink = `${getPath<MeteringPointSubPaths>('update-customer-details')}`;
  createChargeLinkLink = `${getPath<MeteringPointSubPaths>('charge-links')}`;
  getHistoricalCorrectionLink = `${getPath<MeteringPointSubPaths>('historical-correction')}`;

  meteringPointId = input.required<string>();
  internalMeteringPointId = input.required<string>();
  type = input<ElectricityMarketMeteringPointType | null>();
  subType = input<ElectricityMarketViewMeteringPointSubType | null>();
  connectionState = input<ElectricityMarketViewConnectionState | null>();
  createdDate = input<Date | null>();
  installationAddress = input<InstallationAddress | null>();
  isEnergySupplierResponsible = input.required<boolean>();
  isChildMeteringPoint = input<boolean | null>(false);
  searchMigratedMeteringPoints = input.required<boolean>();

  // Change-of-supplier and move-in can only be initiated on a parent metering
  // point of type Consumption (E17) or Production (E18).
  private readonly isEligibleForCustomerProcesses = computed(
    () =>
      !this.isChildMeteringPoint() &&
      (this.type() === ElectricityMarketMeteringPointType.Consumption ||
        this.type() === ElectricityMarketMeteringPointType.Production)
  );

  private readonly hasGridAccessProviderRole = toSignal(
    this.permissionService.hasMarketRole(EicFunction.GridAccessProvider),
    { initialValue: false }
  );

  private readonly hasMessurementsManagePermission = toSignal(
    this.permissionService.hasPermission('measurements:manage'),
    { initialValue: false }
  );

  private readonly hasMeteringPointMoveInPermission = toSignal(
    this.permissionService.hasPermission('metering-point:move-in'),
    { initialValue: false }
  );

  private readonly hasMeteringPointPricesManagePermission = toSignal(
    this.permissionService.hasPermission('metering-point:prices-manage'),
    { initialValue: false }
  );

  private readonly hasDh3SkalpellenPermission = toSignal(
    this.permissionService.hasPermission('dh3-skalpellen'),
    { initialValue: false }
  );

  private readonly hasConnectionStateManagePermission = toSignal(
    this.permissionService.hasPermission('metering-point:connection-state-manage'),
    { initialValue: false }
  );

  private readonly hasMeteringPointEndOfSupplyRequestPermission = toSignal(
    this.permissionService.hasPermission('metering-point:end-of-supply-request'),
    { initialValue: false }
  );

  private readonly hasServiceRequestPermission = toSignal(
    this.permissionService.hasPermission('metering-point:service-request-request'),
    { initialValue: false }
  );

  private readonly hasMeteringPointChangeOfSupplierPermission = toSignal(
    this.permissionService.hasPermission('metering-point:change-of-supplier'),
    { initialValue: false }
  );

  private readonly hasMeteringPointHistoricalCorrectionPermission = toSignal(
    this.permissionService.hasPermission('metering-point:historical-correction-manage'),
    { initialValue: false }
  );

  showMeasurementsUploadButton = computed(() => {
    return (
      this.hasMessurementsManagePermission() &&
      this.releaseToggleService.isEnabled('PM96-SHAREMEASUREDATA') &&
      !this.isCalculatedMeteringPoint() &&
      this.hasGridAccessProviderRole()
    );
  });

  showMoveInButton = computed(() => {
    return (
      this.hasMeteringPointMoveInPermission() &&
      this.releaseToggleService.isEnabled('MoveInBrs009') &&
      (this.connectionState() === ElectricityMarketViewConnectionState.New ||
        this.connectionState() === ElectricityMarketViewConnectionState.Connected ||
        this.connectionState() === ElectricityMarketViewConnectionState.Disconnected) &&
      this.isEligibleForCustomerProcesses()
    );
  });

  showCreateChargeLinkButton = computed(() => {
    return (
      this.hasMeteringPointPricesManagePermission() &&
      this.releaseToggleService.isEnabled('PM60-CHARGE-LINKS-UI')
    );
  });

  showConnectionStateManageButton = computed(
    () =>
      this.hasConnectionStateManagePermission() &&
      (this.connectionState() === ElectricityMarketViewConnectionState.New ||
        this.connectionState() === ElectricityMarketViewConnectionState.Connected ||
        this.connectionState() === ElectricityMarketViewConnectionState.Disconnected)
  );

  showHistoricalCorrectionButton = computed(
    () =>
      this.type() === ElectricityMarketMeteringPointType.Consumption &&
      this.hasMeteringPointHistoricalCorrectionPermission() &&
      this.releaseToggleService.isEnabled('PM63-HISTORICAL-CORRECTIONS-UI')
  );

  showManualCorrectionButtons = computed(
    () => this.hasDh3SkalpellenPermission() && this.searchMigratedMeteringPoints()
  );

  showEndOfSupplyButton = computed(
    () =>
      this.hasMeteringPointEndOfSupplyRequestPermission() &&
      this.isEnergySupplierResponsible() &&
      this.releaseToggleService.isEnabled('PM51-END-OF-SUPPLY-CIM')
  );

  showServiceRequestButton = computed(
    () =>
      this.hasServiceRequestPermission() &&
      this.isEnergySupplierResponsible() &&
      this.releaseToggleService.isEnabled('PM51-END-OF-SUPPLY-CIM')
  );

  // Change-of-supplier is initiated by the incoming (new) supplier, not the current responsible one.
  showChangeOfSupplierButton = computed(
    () =>
      this.hasMeteringPointChangeOfSupplierPermission() &&
      !this.isEnergySupplierResponsible() &&
      this.isEligibleForCustomerProcesses() &&
      this.releaseToggleService.isEnabled('PM50-CHANGE-OF-SUPPLIER-UI')
  );

  showActionsButton = computed(() => {
    return (
      this.showMeasurementsUploadButton() ||
      this.showMoveInButton() ||
      this.isEnergySupplierResponsible() ||
      this.showCreateChargeLinkButton() ||
      this.showManualCorrectionButtons() ||
      this.showConnectionStateManageButton() ||
      this.showEndOfSupplyButton() ||
      this.showServiceRequestButton() ||
      this.showChangeOfSupplierButton() ||
      this.showHistoricalCorrectionButton()
    );
  });

  startMoveIn() {
    this.modalService.open({
      component: DhStartMoveInComponent,
      data: {
        meteringPointId: this.meteringPointId(),
        energySupplier: this.actor.getSelectedActor().gln,
      },
      disableClose: true,
    });
  }

  startEndOfSupply() {
    this.modalService.open({
      component: DhEndOfSupplyComponent,
      data: {
        meteringPointId: this.meteringPointId(),
        internalMeteringPointId: this.internalMeteringPointId(),
      },
    });
  }

  startServiceRequest() {
    this.modalService.open({
      component: DhServiceRequestModal,
      data: {
        meteringPointId: this.meteringPointId(),
        internalMeteringPointId: this.internalMeteringPointId(),
      },
    });
  }

  startChangeOfSupplier() {
    this.modalService.open({
      component: DhChangeOfSupplierComponent,
      data: {
        meteringPointId: this.meteringPointId(),
        internalMeteringPointId: this.internalMeteringPointId(),
      },
      disableClose: true,
    });
  }

  connectionStateManage() {
    const currentConnectionState = this.connectionState();
    const currentCreatedDate = this.createdDate();

    assertIsDefined(currentConnectionState);

    this.modalService.open({
      component: DhConnectionStateManageComponent,
      data: {
        currentConnectionState,
        currentCreatedDate,
        meteringPointId: this.meteringPointId(),
        meteringPointType: this.type(),
      },
    });
  }
}
