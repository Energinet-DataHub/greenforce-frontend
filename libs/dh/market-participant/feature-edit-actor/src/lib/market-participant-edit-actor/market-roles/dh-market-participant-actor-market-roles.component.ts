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
import {
  ActorDto,
  EicFunction,
  MarketRoleDto,
} from '@energinet-datahub/dh/shared/domain';
import { TranslocoModule } from '@ngneat/transloco';
import { MatListModule } from '@angular/material/list';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { MarketRoleService } from './market-role.service';

@Component({
  selector: 'dh-market-participant-actor-market-roles',
  templateUrl: './dh-market-participant-actor-market-roles.component.html',
  providers: [MarketRoleService]
})
export class DhMarketParticipantActorMarketRolesComponent implements OnChanges {
  @Input() actor: ActorDto | undefined;
  @Output() hasChanges = new EventEmitter<MarketRoleChanges>();
  changes: MarketRoleChanges = { marketRoles: [] };
  listModel = Array<EicFunction>();
  availableMarketRoles = Array<EicFunction>();

  constructor(private marketRoleService: MarketRoleService) {
    this.availableMarketRoles = this.marketRoleService.getAvailableMarketRoles;
  }

  ngOnChanges(): void {
    if (this.actor !== undefined) {
      this.changes = {
        marketRoles: this.actor.marketRoles,
      };
      this.listModel = this.changes.marketRoles.map((e) => e.eicFunction);
      this.hasChanges.emit({ ...this.changes });
    }
  }

  invalidInCurrentSelection(item: EicFunction) {
    return this.marketRoleService.notValidInAnySelectionGroup(
      item,
      this.listModel
    );
  }

  readonly onSelectionChange = () => {
    this.changes.marketRoles = this.listModel.map((e) => {
      return <MarketRoleDto>{ eicFunction: e };
    });
    this.hasChanges.emit({ ...this.changes });
  };
}

@NgModule({
  imports: [CommonModule, FormsModule, TranslocoModule, MatListModule],
  exports: [DhMarketParticipantActorMarketRolesComponent],
  declarations: [DhMarketParticipantActorMarketRolesComponent],
})
export class DhMarketParticipantActorMarketRolesComponentScam {}
