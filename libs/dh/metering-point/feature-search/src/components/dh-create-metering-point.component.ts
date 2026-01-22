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
import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { from, Observable, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { WattRadioComponent } from '@energinet/watt/radio';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattFieldErrorComponent, WattFieldComponent } from '@energinet/watt/field';
import { dayjs } from '@energinet/watt/date';

import {
  ElectricityMarketViewAssetType,
  ElectricityMarketViewConnectionType,
  ElectricityMarketViewDisconnectionType,
  ElectricityMarketViewMeteringPointSubType,
  ElectricityMarketViewProduct,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { getGridAreaOptionsForPeriod } from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';

import { dhMeteringPointTypeParam } from './dh-metering-point-params';
import { dhMeteringPointIdValidator } from './dh-metering-point.validator';

enum CountryCode {
  DK = 'DK',
  SE = 'SE',
  NO = 'NO',
  FI = 'FI',
  DE = 'DE',
}

@Component({
  selector: 'dh-create-metering-point',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslocoDirective,
    TranslocoPipe,

    VaterStackComponent,
    VaterSpacerComponent,
    VaterFlexComponent,
    WATT_CARD,
    WattButtonComponent,
    WattTextFieldComponent,
    WattRadioComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattTextAreaFieldComponent,
    WattFieldErrorComponent,
    WattFieldComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      display: block;
      padding: var(--watt-space-ml);
    }

    .page-grid {
      align-items: flex-start;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--watt-space-m);
    }

    .country-dropdown {
      width: 200px;
    }
  `,
  templateUrl: './dh-create-metering-point.component.html',
})
export class DhCreateMeteringPoint {
  private readonly marketParticipantId = inject(DhActorStorage).getSelectedActorId();

  readonly mpType = inject(ActivatedRoute)?.snapshot.queryParamMap.get(dhMeteringPointTypeParam);

  today = dayjs().startOf('day').toDate();
  yesterday = dayjs(this.today).subtract(1, 'day').startOf('day').toDate();

  form = new FormGroup({
    details: new FormGroup({
      validityDate: dhMakeFormControl<Date | null>(this.today, Validators.required),
      meteringPointId: dhMakeFormControl('', [Validators.required, dhMeteringPointIdValidator()]),
      subType: dhMakeFormControl<ElectricityMarketViewMeteringPointSubType>(
        ElectricityMarketViewMeteringPointSubType.Physical,
        Validators.required
      ),
      meteringPointNumber: dhMakeFormControl('', Validators.required),
      powerLimitKw: dhMakeFormControl(''),
      powerLimitAmpere: dhMakeFormControl(''),
      disconnectionType: dhMakeFormControl<ElectricityMarketViewDisconnectionType>(
        ElectricityMarketViewDisconnectionType.RemoteDisconnection,
        Validators.required
      ),
      gridArea: dhMakeFormControl('', Validators.required),
    }),
    address: new FormGroup({
      countryCode: dhMakeFormControl<CountryCode>(CountryCode.DK, Validators.required),
      washInstructions: dhMakeFormControl<'WASHABLE' | 'NOT_WASHABLE'>(
        'WASHABLE',
        Validators.required
      ),
      streetName: dhMakeFormControl('', Validators.required),
      buildingNumber: dhMakeFormControl('', Validators.required),
      floor: dhMakeFormControl(''),
      room: dhMakeFormControl(''),
      postCode: dhMakeFormControl('', Validators.required),
      cityName: dhMakeFormControl('', Validators.required),
      citySubDivisionName: dhMakeFormControl(''),
      streetCode: dhMakeFormControl('', Validators.required),
      municipalityCode: dhMakeFormControl('', Validators.required),
      darID: dhMakeFormControl('', Validators.required),
      comment: dhMakeFormControl(''),
    }),
    powerPlant: new FormGroup({
      netSettlementGroup: dhMakeFormControl<'0' | '3'>('0', Validators.required),
      capacity: dhMakeFormControl(''),
      gsrnNumber: dhMakeFormControl(''),
      connectionType: dhMakeFormControl<ElectricityMarketViewConnectionType>(ElectricityMarketViewConnectionType.Direct),
      assetType: dhMakeFormControl<ElectricityMarketViewAssetType>(),
    }),
    other: new FormGroup({
      resolution: dhMakeFormControl<'quarterHourly' | 'hourly'>(
        'quarterHourly',
        Validators.required
      ),
      measureUnit: dhMakeFormControl<'K_WH' | 'KV_ARH'>('K_WH', Validators.required),
    }),
  });

  gridAreaOptions = toSignal(this.getGridAreaOptions(), {
    initialValue: [],
  });

  MeteringPointSubType = ElectricityMarketViewMeteringPointSubType;
  DisconnectionType = ElectricityMarketViewDisconnectionType;
  ConnectionType = ElectricityMarketViewConnectionType;
  Product = ElectricityMarketViewProduct;

  countryOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(CountryCode);
  assetTypeOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(ElectricityMarketViewAssetType);

  subTypeChanged = toSignal(this.form.controls.details.controls.subType.valueChanges);
  netSettlementGroupChanged = toSignal(
    this.form.controls.powerPlant.controls.netSettlementGroup.valueChanges
  );
  measureUnitChanged = toSignal(this.form.controls.other.controls.measureUnit.valueChanges);

  subTypeEffect = effect(() => {
    const subType = this.subTypeChanged();

    if (subType === undefined) return;

    const detailsControls = this.form.controls.details.controls;

    if (subType !== ElectricityMarketViewMeteringPointSubType.Physical) {
      detailsControls.meteringPointNumber.reset();
      detailsControls.meteringPointNumber.removeValidators(Validators.required);
    } else {
      detailsControls.meteringPointNumber.addValidators(Validators.required);
    }

    detailsControls.meteringPointNumber.updateValueAndValidity();
  });

  netSettlementGroupEffect = effect(() => {
    const netSettlementGroup = this.netSettlementGroupChanged();

    if (netSettlementGroup === undefined) return;

    const powerPlantControls = this.form.controls.powerPlant.controls;

    if (netSettlementGroup === '3') {
      powerPlantControls.capacity.addValidators(Validators.required);
      powerPlantControls.gsrnNumber.addValidators(Validators.required);
      powerPlantControls.connectionType.addValidators(Validators.required);
      powerPlantControls.assetType.addValidators(Validators.required);
    } else if (netSettlementGroup === '0') {
      powerPlantControls.capacity.removeValidators(Validators.required);
      powerPlantControls.gsrnNumber.removeValidators(Validators.required);
      powerPlantControls.connectionType.removeValidators(Validators.required);
      powerPlantControls.assetType.removeValidators(Validators.required);

      powerPlantControls.capacity.reset();
      powerPlantControls.gsrnNumber.reset();
      powerPlantControls.connectionType.reset();

      powerPlantControls.assetType.reset();
      powerPlantControls.assetType.markAsPristine();
      powerPlantControls.assetType.markAsUntouched();
    }

    powerPlantControls.capacity.updateValueAndValidity();
    powerPlantControls.gsrnNumber.updateValueAndValidity();
    powerPlantControls.connectionType.updateValueAndValidity();
    powerPlantControls.assetType.updateValueAndValidity();
  });

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    return from(
      getGridAreaOptionsForPeriod(
        {
          start: this.yesterday,
          end: this.today,
        },
        this.marketParticipantId
      )
    ).pipe(
      tap((gridAreaOptions) => {
        if (gridAreaOptions.length === 1) {
          this.form.controls.details.controls.gridArea.setValue(gridAreaOptions[0].value);
        }
      })
    );
  }

  save() {
    console.log('Saving metering point', this.form.valid, this.form.value);
  }
}
