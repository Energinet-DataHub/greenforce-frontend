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
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { DhMeteringPointStatusBadgeScam } from '@energinet-datahub/dh/metering-point/ui-status-badge';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';

export interface MeteringPointIdentityTranslationKeys {
  meteringMethod: string;
  meteringPointType: string;
  readingOccurrence: string;
  settlementMethod?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-identity',
  styleUrls: ['./dh-metering-point-identity.component.scss'],
  templateUrl: './dh-metering-point-identity.component.html',
})
export class DhMeteringPointIdentityComponent {
  #meteringPoint: MeteringPointCimDto | undefined;

  translationKeys: MeteringPointIdentityTranslationKeys | undefined;

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
    let translationKeys: MeteringPointIdentityTranslationKeys = {
      meteringMethod: `meteringPoint.meteringPointSubTypeCode.${meteringPoint.meteringMethod}`,
      meteringPointType: `meteringPoint.meteringPointTypeCode.${meteringPoint.meteringPointType}`,
      readingOccurrence: `meteringPoint.readingOccurrenceCode.${meteringPoint.readingOccurrence}`,
    };

    if (meteringPoint?.settlementMethod) {
      translationKeys = {
        ...translationKeys,
        settlementMethod: `meteringPoint.settlementMethodCode.${meteringPoint.settlementMethod}`,
      };
    }

    return translationKeys;
  }
}

@NgModule({
  declarations: [DhMeteringPointIdentityComponent],
  exports: [DhMeteringPointIdentityComponent],
  imports: [
    DhMeteringPointStatusBadgeScam,
    DhEmDashFallbackPipeScam,
    CommonModule,
    TranslocoModule,
  ],
})
export class DhMeteringPointIdentityScam {}
