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
import { ActorChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { ActorDto } from '@energinet-datahub/dh/shared/domain';
import { WattFormFieldModule, WattInputModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';

@Component({
  selector: 'dh-market-participant-actor-master-data',
  styleUrls: ['./dh-market-participant-actor-master-data.component.scss'],
  templateUrl: './dh-market-participant-actor-master-data.component.html',
})
export class DhMarketParticipantActorMasterDataComponent implements OnChanges {
  @Input() actor: ActorDto | undefined;
  @Output() hasChanges = new EventEmitter<ActorChanges>();
  changes: ActorChanges = { gln: '', marketRoles: [], meteringPointTypes: [] };

  ngOnChanges(): void {
    if (this.actor !== undefined) {
      this.changes = {
        gln: this.actor.gln.value,
        marketRoles: this.actor.marketRoles,
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
  imports: [
    CommonModule,
    LetModule,
    FormsModule,
    TranslocoModule,
    WattFormFieldModule,
    WattInputModule,
  ],
  exports: [DhMarketParticipantActorMasterDataComponent],
  declarations: [DhMarketParticipantActorMasterDataComponent],
})
export class DhMarketParticipantActorMasterDataComponentScam {}
