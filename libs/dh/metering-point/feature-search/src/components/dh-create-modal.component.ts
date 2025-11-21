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
import { Component, inject, viewChild } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';

import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { BasePaths, getPath, MeteringPointSubPaths } from '@energinet-datahub/dh/core/routing';
import { ElectricityMarketMeteringPointType } from '@energinet-datahub/dh/shared/domain/graphql';

import { dhMeteringPointTypeParam } from './dh-metering-point-params';
import { dhSupportedMeteringPointTypes } from './dh-supported-metering-point-types';

@Component({
  selector: 'dh-create-metering-point-modal',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattButtonComponent,
    WATT_MODAL,
    WattDropdownComponent,
  ],
  template: `<watt-modal
    *transloco="let t; prefix: 'meteringPoint.create.modal'"
    #modal
    size="small"
    [title]="t('title')"
  >
    <watt-dropdown
      [options]="options"
      [formControl]="typeControl"
      [showResetOption]="false"
      [label]="t('label')"
      [placeholder]="t('placeholder')"
    />

    <watt-modal-actions>
      <watt-button variant="secondary" (click)="modal.close(false)">{{ t('cancel') }}</watt-button>

      <watt-button (click)="typeControl.valid && start()">{{ t('start') }}</watt-button>
    </watt-modal-actions>
  </watt-modal>`,
})
export class DhCreateMeteringPointModalComponent extends WattTypedModal {
  private readonly router = inject(Router);
  private modal = viewChild.required(WattModalComponent);

  typeControl = dhMakeFormControl(
    ElectricityMarketMeteringPointType.Consumption,
    Validators.required
  );

  options: WattDropdownOptions = dhSupportedMeteringPointTypes.map((type) => ({
    displayValue: translate(`meteringPointType.${type}`),
    value: type,
  }));

  start() {
    const path = this.router.createUrlTree(
      [getPath<BasePaths>('metering-point'), getPath<MeteringPointSubPaths>('create')],
      { queryParams: { [dhMeteringPointTypeParam]: this.typeControl.value } }
    );

    this.router.navigateByUrl(path);

    this.modal().close(true);
  }
}
