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
import { WattFormFieldModule, WattInputModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

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
  @Input() organization!: OrganizationWithActor;
  @Input() onMasterDataChanged!: (data: MasterData) => void;
  organizationName: FormControl = new FormControl(
    '',
    Validators.compose([Validators.required, Validators.maxLength(128)])
  );

  ngOnInit(): void {
    this.organizationName.setValue(this.organization.organization.name);
    this.organizationName.valueChanges.subscribe(() => {
      this.onMasterDataChanged({
        valid: this.organizationName.valid,
        name: this.organizationName.value,
      });
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattFormFieldModule,
    WattInputModule,
  ],
  exports: [DhMarketParticipantOrganizationMasterDataComponent],
  declarations: [DhMarketParticipantOrganizationMasterDataComponent],
})
export class DhMarketParticipantOrganizationMasterDataComponentScam {}
