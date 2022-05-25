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
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { MatListModule } from '@angular/material/list';

import { EicFunction } from '@energinet-datahub/dh/shared/domain';

import { MarketRoleService } from './market-role.service';

@Component({
  selector: 'dh-market-participant-actor-market-roles',
  templateUrl: './dh-market-participant-actor-market-roles.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MarketRoleService],
})
export class DhMarketParticipantActorMarketRolesComponent {
  @Input() marketRolesEicFunctions: EicFunction[] = [];

  @Output() marketRolesEicFunctionsChange = new EventEmitter<EicFunction[]>();

  availableMarketRoles: EicFunction[] =
    this.marketRoleService.getAvailableMarketRoles;

  constructor(private marketRoleService: MarketRoleService) {}

  invalidInCurrentSelection(item: EicFunction) {
    return this.marketRoleService.notValidInAnySelectionGroup(
      item,
      this.marketRolesEicFunctions
    );
  }

  onSelectionChange(marketRolesEicFunctions: EicFunction[]): void {
    this.marketRolesEicFunctionsChange.emit(marketRolesEicFunctions);
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, TranslocoModule, MatListModule],
  exports: [DhMarketParticipantActorMarketRolesComponent],
  declarations: [DhMarketParticipantActorMarketRolesComponent],
})
export class DhMarketParticipantActorMarketRolesComponentScam {}
