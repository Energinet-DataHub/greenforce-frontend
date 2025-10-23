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

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
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
import { DhPermissionRequiredDirective, PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhMoveInComponent } from '@energinet-datahub/dh/metering-point/feature-move-in';
import { DhReleaseToggleService } from '@energinet-datahub/dh/shared/release-toggle';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { InstallationAddress } from '../types';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map } from 'rxjs';

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
            <watt-icon name="plus" />
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
              <watt-icon name="plus" />
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

  protected readonly hasAllowedMarketRolesForSendMeasurementsRequest = toSignal(
    combineLatest([
      this.permissionService.hasMarketRole(EicFunction.MeteredDataResponsible),
      this.permissionService.hasMarketRole(EicFunction.GridAccessProvider),
      this.permissionService.hasMarketRole(EicFunction.Delegated),
    ]).pipe(
      map(([hasMeteredDataResponsible, hasGridAccessProvider, hasDelegated]) =>
        hasMeteredDataResponsible || hasGridAccessProvider || hasDelegated
      )
    ),
    { initialValue: false }
  );

  showMeasurementsUploadButton = computed(() => {
    return (
      this.releaseToggleService.isEnabled('PM96-SHAREMEASUREDATA') &&
      !this.isCalculatedMeteringPoint() &&
      this.hasAllowedMarketRolesForSendMeasurementsRequest()
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
      component: DhMoveInComponent,
      data: { installationAddress: this.installationAddress() },
      disableClose: true,
    });
  }
}
