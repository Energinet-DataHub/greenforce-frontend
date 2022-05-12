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
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MeteringPointTypeChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  ActorDto,
  MarketParticipantMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { TranslocoModule } from '@ngneat/transloco';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'dh-market-participant-actor-metering-point-type',
  templateUrl:
    './dh-market-participant-actor-metering-point-type.component.html',
})
export class DhMarketParticipantActorMeteringPointTypeComponent
  implements OnChanges
{
  @Input() actor: ActorDto | undefined;
  @Output() hasChanges = new EventEmitter<MeteringPointTypeChanges>();
  changes: MeteringPointTypeChanges = { meteringPointTypes: [] };
  availableMeteringPointTypes = Object.values(
    MarketParticipantMeteringPointType
  );

  ngOnChanges(): void {
    if (this.actor !== undefined) {
      this.changes = {
        meteringPointTypes: this.actor.meteringPointTypes,
      };
      this.hasChanges.emit({ ...this.changes });
    }
  }

  readonly onModelChanged = () => {
    this.hasChanges.emit({ ...this.changes });
  };
}

@NgModule({
  imports: [CommonModule, FormsModule, TranslocoModule, MatListModule],
  exports: [DhMarketParticipantActorMeteringPointTypeComponent],
  declarations: [DhMarketParticipantActorMeteringPointTypeComponent],
})
export class DhMarketParticipantActorMeteringPointTypeComponentScam {}
