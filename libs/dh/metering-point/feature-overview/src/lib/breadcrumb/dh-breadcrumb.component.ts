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
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { WattIconModule } from '@energinet-datahub/watt/icon';
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { DhIsParentPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';

export interface MeteringPointTranslationKeys {
  meteringMethod: string;
  meteringPointType: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-breadcrumb',
  templateUrl: './dh-breadcrumb.component.html',
  styleUrls: ['./dh-breadcrumb.component.scss'],
  imports: [CommonModule, RouterModule, TranslocoModule, WattIconModule, DhIsParentPipeScam],
})
export class DhBreadcrumbComponent {
  #meteringPoint: MeteringPointCimDto | undefined;

  meteringPointAbsolutePath = ['/', dhMeteringPointPath];

  translationKeys: MeteringPointTranslationKeys | undefined;

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
  get meteringPointParentPath() {
    return ['/', dhMeteringPointPath, this.meteringPoint?.parentMeteringPoint?.gsrnNumber];
  }

  private buildTranslations(meteringPoint: MeteringPointCimDto): MeteringPointTranslationKeys {
    const meteringMethod = `meteringPoint.meteringPointSubTypeCode.${
      meteringPoint?.meteringMethod ?? ''
    }`;
    const meteringPointType = `meteringPoint.meteringPointTypeCode.${
      meteringPoint?.meteringPointType ?? ''
    }`;

    return {
      meteringMethod,
      meteringPointType,
    };
  }
}
