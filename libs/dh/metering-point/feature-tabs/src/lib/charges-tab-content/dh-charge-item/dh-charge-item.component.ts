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
import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChargeLinkV1Dto,
  ChargeType,
} from '@energinet-datahub/dh/shared/domain';
import { TranslocoModule } from '@ngneat/transloco';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

@Component({
  selector: 'dh-charge-item',
  templateUrl: './dh-charge-item.component.html',
  styleUrls: ['./dh-charge-item.component.scss'],
})
export class DhChargeItemComponent {
  @Input() charges: Array<ChargeLinkV1Dto> = [];
  @Input() title = '';
  chargeTypes = ChargeType;
}

@NgModule({
  imports: [
    TranslocoModule,
    CommonModule,
    WattEmptyStateModule,
    MatTableModule,
    DhSharedUiDateTimeModule,
    WattIconModule,
  ],
  declarations: [DhChargeItemComponent],
  exports: [DhChargeItemComponent],
})
export class DhChargeItemScam {}
