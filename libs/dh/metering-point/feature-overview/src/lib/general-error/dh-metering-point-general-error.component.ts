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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  NgModule,
  Output,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-general-error',
  templateUrl: './dh-metering-point-general-error.component.html',
})
export class DhMeteringPointGeneralErrorComponent {
  @Output() reload = new EventEmitter<void>();
}

@NgModule({
  declarations: [DhMeteringPointGeneralErrorComponent],
  exports: [DhMeteringPointGeneralErrorComponent],
  imports: [TranslocoModule, WattButtonModule, WattEmptyStateModule],
})
export class DhMeteringPointGeneralErrorScam {}
