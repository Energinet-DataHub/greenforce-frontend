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
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointForManualCorrectionDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { toFile } from '@energinet-datahub/dh/shared/ui-util';
import { WattMenuItemComponent } from '@energinet/watt/menu';

@Component({
  selector: 'dh-get-metering-point-for-manual-correction',
  imports: [TranslocoDirective, ReactiveFormsModule, WattMenuItemComponent],
  template: `
    <watt-menu-item
      *transloco="let t; prefix: 'meteringPoint.overview.manualCorrection'"
      (click)="getMeteringPointForManualCorrection()"
    >
      <span>{{ t('getMeteringPoint') }}</span>
    </watt-menu-item>
  `,
})
export class DhGetMeteringPointForManualCorrectionComponent {
  meteringPointId = input.required<string>();

  private readonly getMeteringPointForManualCorrectionQuery = lazyQuery(
    GetMeteringPointForManualCorrectionDocument,
    { fetchPolicy: 'no-cache' }
  );

  async getMeteringPointForManualCorrection() {
    const result = await this.getMeteringPointForManualCorrectionQuery.query({
      variables: {
        meteringPointId: this.meteringPointId(),
      },
    });

    toFile({
      data: result.data.meteringPointForManualCorrection,
      name: `${this.meteringPointId()}.json`,
      type: 'application/json;charset=utf-8;',
    });
  }
}
