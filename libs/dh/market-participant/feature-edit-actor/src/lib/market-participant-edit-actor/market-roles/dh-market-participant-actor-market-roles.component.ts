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
   MarketRoleDto
 } from '@energinet-datahub/dh/shared/domain';
 import { TranslocoModule } from '@ngneat/transloco';
 import { MatListModule } from '@angular/material/list';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';

 @Component({
   selector: 'dh-market-participant-actor-market-roles',
   templateUrl:
     './dh-market-participant-actor-market-roles.component.html',
 })
 export class DhMarketParticipantActorMarketRolesComponent
   implements OnChanges
 {
   @Input() actor: ActorDto | undefined;
   @Output() hasChanges = new EventEmitter<MarketRoleChanges>();
   changes: MarketRoleChanges = { marketRoles: [] };
   availableMarketRoles = Object.values(
     EicFunction
   ).map(e => { return <MarketRoleDto> { _function: e as string } });

   ngOnChanges(): void {
    if (this.actor !== undefined) {
      this.changes = {
        marketRoles: this.actor.marketRoles,
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
   exports: [DhMarketParticipantActorMarketRolesComponent],
   declarations: [DhMarketParticipantActorMarketRolesComponent],
 })
 export class DhMarketParticipantActorMarketRolesComponentScam {}
