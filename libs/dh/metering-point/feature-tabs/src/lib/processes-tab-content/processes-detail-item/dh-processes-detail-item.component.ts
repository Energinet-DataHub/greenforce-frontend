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
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { ProcessDetail } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattValidationMessageModule } from '@energinet-datahub/watt/validation-message';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-processes-detail-item',
  templateUrl: './dh-processes-detail-item.component.html',
  styleUrls: ['./dh-processes-detail-item.component.scss'],
})
export class DhProcessesDetailItemComponent {
  private _detail!: ProcessDetail;

  @Input()
  set detail(value: ProcessDetail) {
    if (value === undefined) {
      throw new Error('ProcessDetail is undefined');
    }

    this._detail = value;
  }
  get detail(): ProcessDetail {
    return this._detail;
  }
}

@NgModule({
  declarations: [DhProcessesDetailItemComponent],
  imports: [
    WattIconModule,
    CommonModule,
    DhSharedUiDateTimeModule,
    TranslocoModule,
    WattValidationMessageModule,
  ],
  exports: [DhProcessesDetailItemComponent],
})
export class DhProcessesDetailItemScam {}
