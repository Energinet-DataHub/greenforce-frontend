/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';

import { DhMeteringPointStatusBadgeScam } from '../status-badge/dh-metering-point-status-badge.component';
import { emDash } from './em-dash';

export interface MeteringPointIdentityTranslationKeys {
  meteringMethod: string;
  meteringPointType: string;
  readingOccurrence: string;
  settlementMethod: string;
}

@Component({
  selector: 'dh-metering-point-identity',
  styleUrls: ['./dh-metering-point-identity.component.scss'],
  templateUrl: './dh-metering-point-identity.component.html',
})
export class DhMeteringPointIdentityComponent {
  #meteringPoint: MeteringPointCimDto | undefined;

  translationKeys: MeteringPointIdentityTranslationKeys | undefined;
  emDash = emDash;

  @Input()
  set meteringPoint(value: MeteringPointCimDto | undefined) {
    if (value == undefined) {
      return;
    }

    this.#meteringPoint = value;
    this.translationKeys = this.buildTranslations(value);
  }
  get meteringPoint() {
    return this.#meteringPoint;
  }

  private buildTranslations(
    meteringPoint: MeteringPointCimDto
  ): MeteringPointIdentityTranslationKeys {
    const meteringMethod = `meteringPoint.meteringPointSubTypeCode.${
      meteringPoint?.meteringMethod ?? ''
    }`;
    const meteringPointType = `meteringPoint.meteringPointTypeCode.${
      meteringPoint?.meteringPointType ?? ''
    }`;
    const readingOccurrence = `meteringPoint.readingOccurrenceCode.${
      meteringPoint?.readingOccurrence ?? ''
    }`;
    const settlementMethod = `meteringPoint.settlementMethodCode.${
      meteringPoint?.settlementMethod ?? ''
    }`;

    return {
      meteringMethod,
      meteringPointType,
      readingOccurrence,
      settlementMethod,
    };
  }
}

@NgModule({
  declarations: [DhMeteringPointIdentityComponent],
  exports: [DhMeteringPointIdentityComponent],
  imports: [DhMeteringPointStatusBadgeScam, CommonModule, TranslocoModule],
})
export class DhMeteringPointIdentityScam {}
