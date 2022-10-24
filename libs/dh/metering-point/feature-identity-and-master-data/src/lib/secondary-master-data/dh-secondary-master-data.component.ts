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
import { Component, Input, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import {
  MeteringPointCimDto,
  NetSettlementGroup,
} from '@energinet-datahub/dh/shared/domain';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattExpansionModule } from '@energinet-datahub/watt/expansion';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  DhEmDashFallbackPipeScam,
  DhIsParentPipeScam,
  DhShowForMeteringPointTypeDirectiveScam,
  DhYesNoPipeScam,
} from '@energinet-datahub/dh/metering-point/shared/ui-util';

export interface MeteringPointIdentityTranslationKeys {
  unit: string;
  disconnectionType?: string;
  connectionType?: string;
  assetType?: string;
  productId: string;
  capacityFormatted?: string;
  ratedCapacityFormatted?: string;
  ratedCurrentFormatted?: string;
}

@Component({
  selector: 'dh-secondary-master-data',
  templateUrl: './dh-secondary-master-data.component.html',
  styleUrls: ['./dh-secondary-master-data.component.scss'],
})
export class DhSecondaryMasterDataComponent {
  #secondaryMasterData: MeteringPointCimDto | undefined;

  translationKeys: MeteringPointIdentityTranslationKeys | undefined;

  @Input()
  set secondaryMasterData(value: MeteringPointCimDto | undefined) {
    if (value == undefined) {
      return;
    }

    this.#secondaryMasterData = value;
    this.translationKeys = this.buildTranslations(value);
  }
  get secondaryMasterData() {
    return this.#secondaryMasterData;
  }

  get netSettlementGroupAsNumber(): number | undefined {
    switch (this.#secondaryMasterData?.netSettlementGroup) {
      case NetSettlementGroup.Zero:
        return 0;
      case NetSettlementGroup.One:
        return 1;
      case NetSettlementGroup.Two:
        return 2;
      case NetSettlementGroup.Three:
        return 3;
      case NetSettlementGroup.Six:
        return 6;
      case NetSettlementGroup.NinetyNine:
        return 99;
      default:
        return;
    }
  }

  private buildTranslations(
    meteringPoint: MeteringPointCimDto
  ): MeteringPointIdentityTranslationKeys {
    let translationKeys: MeteringPointIdentityTranslationKeys = {
      productId: `meteringPoint.productId.${meteringPoint.productId}`,
      unit: `meteringPoint.unit.${meteringPoint.unit}`,
    };

    if (meteringPoint.disconnectionType) {
      translationKeys = {
        ...translationKeys,
        disconnectionType: `meteringPoint.disconnectionType.${meteringPoint.disconnectionType}`,
      };
    }

    if (meteringPoint.connectionType) {
      translationKeys = {
        ...translationKeys,
        connectionType: `meteringPoint.connectionType.${meteringPoint.connectionType}`,
      };
    }

    if (meteringPoint.assetType) {
      translationKeys = {
        ...translationKeys,
        assetType: `meteringPoint.assetType.${meteringPoint.assetType}`,
      };
    }

    if (meteringPoint.capacity) {
      translationKeys = {
        ...translationKeys,
        capacityFormatted: `meteringPoint.secondaryMasterData.capacityFormatted`,
      };
    }

    if (meteringPoint.ratedCapacity) {
      translationKeys = {
        ...translationKeys,
        ratedCapacityFormatted: `meteringPoint.secondaryMasterData.ratedCapacityFormatted`,
      };
    }

    if (meteringPoint.ratedCurrent) {
      translationKeys = {
        ...translationKeys,
        ratedCurrentFormatted: `meteringPoint.secondaryMasterData.ratedCurrentFormatted`,
      };
    }

    return translationKeys;
  }
}

@NgModule({
  declarations: [DhSecondaryMasterDataComponent],
  imports: [
    WattExpansionModule,
    CommonModule,
    TranslocoModule,
    WattIconModule,
    DhYesNoPipeScam,
    DhSharedUiDateTimeModule,
    DhShowForMeteringPointTypeDirectiveScam,
    DhIsParentPipeScam,
    DhEmDashFallbackPipeScam,
  ],
  exports: [DhSecondaryMasterDataComponent],
})
export class DhSecondaryMasterDataComponentScam {}
