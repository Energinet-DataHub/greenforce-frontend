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
import { Component, Input, NgModule, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MasterData,
  OrganizationWithActor,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  WattDropdownModule,
  WattDropdownOption,
  WattFormFieldModule,
  WattInputModule,
} from '@energinet-datahub/watt';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'dh-market-participant-organization-master-data',
  styleUrls: [
    './dh-market-participant-organization-master-data.component.scss',
  ],
  templateUrl:
    './dh-market-participant-organization-master-data.component.html',
  providers: [],
})
export class DhMarketParticipantOrganizationMasterDataComponent
  implements OnInit
{
  constructor(private translocoService: TranslocoService) {}

  @Input() organization!: OrganizationWithActor;
  @Input() onMasterDataChanged!: (data: MasterData) => void;

  organizationName: FormControl = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.maxLength(3)])
  );

  businessRegistrationIdentifier: FormControl = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.pattern('[0-9]{8}')])
  );

  streetName: FormControl = new FormControl('', Validators.maxLength(3));

  streetNumber: FormControl = new FormControl('', Validators.maxLength(3));

  zipCode: FormControl = new FormControl('', Validators.maxLength(3));

  city: FormControl = new FormControl('', Validators.maxLength(3));

  country: FormControl = new FormControl('', Validators.required);

  countries: WattDropdownOption[] = [];

  ngOnInit(): void {
    const countryTranslations = this.translocoService.translateObject(
      'marketParticipant.organization.create.masterData.countries'
    );
    this.countries = Object.keys(countryTranslations).map((k) => ({
      value: k.toUpperCase(),
      displayValue: countryTranslations[k] as string,
    }));

    this.organizationName.setValue(this.organization.organization.name);
    this.businessRegistrationIdentifier.setValue(
      this.organization.organization.businessRegisterIdentifier
    );
    this.streetName.setValue(this.organization.organization.address.streetName);
    this.streetNumber.setValue(this.organization.organization.address.number);
    this.zipCode.setValue(this.organization.organization.address.zipCode);
    this.city.setValue(this.organization.organization.address.city);
    this.country.setValue(this.organization.organization.address.country);

    this.organizationName.valueChanges.subscribe(this.updateMasterData);
    this.businessRegistrationIdentifier.valueChanges.subscribe(
      this.updateMasterData
    );
    this.streetName.valueChanges.subscribe(this.updateMasterData);
    this.streetNumber.valueChanges.subscribe(this.updateMasterData);
    this.zipCode.valueChanges.subscribe(this.updateMasterData);
    this.city.valueChanges.subscribe(this.updateMasterData);
    this.country.valueChanges.subscribe(this.updateMasterData);
  }

  updateMasterData = () => {
    this.onMasterDataChanged({
      valid:
        this.organizationName.valid &&
        this.businessRegistrationIdentifier.valid &&
        this.streetName.valid &&
        this.streetNumber.valid &&
        this.zipCode.valid &&
        this.country.valid,
      name: this.organizationName.value,
      businessRegistrationIdentifier: this.businessRegistrationIdentifier.value,
      streetName: this.streetName.value,
      streetNumber: this.streetNumber.value,
      zipCode: this.zipCode.value,
      city: this.city.value,
      country: this.country.value,
    });
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattDropdownModule,
    WattFormFieldModule,
    WattInputModule,
  ],
  exports: [DhMarketParticipantOrganizationMasterDataComponent],
  declarations: [DhMarketParticipantOrganizationMasterDataComponent],
})
export class DhMarketParticipantOrganizationMasterDataComponentScam {}
