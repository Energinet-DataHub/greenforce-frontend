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
import { NgIf, NgClass, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { MeteringPointProcessDetail } from '@energinet-datahub/dh/shared/domain';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-processes-detail-item',
  templateUrl: './dh-processes-detail-item.component.html',
  styleUrls: ['./dh-processes-detail-item.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
    WattIconComponent,
    WattDatePipe,
    TranslocoModule,
    WattValidationMessageComponent,
  ],
})
export class DhProcessesDetailItemComponent {
  private _detail!: MeteringPointProcessDetail;

  @Input()
  set detail(value: MeteringPointProcessDetail) {
    if (value === undefined) {
      throw new Error('ProcessDetail is undefined');
    }

    this._detail = value;
  }
  get detail(): MeteringPointProcessDetail {
    return this._detail;
  }
}
