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
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActorChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { ActorDto, ActorStatus } from '@energinet-datahub/dh/shared/domain';
import {
  WattDropdownModule,
  WattDropdownOption,
  WattFormFieldModule,
  WattInputModule,
} from '@energinet-datahub/watt';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dh-market-participant-actor-master-data',
  styleUrls: ['./dh-market-participant-actor-master-data.component.scss'],
  templateUrl: './dh-market-participant-actor-master-data.component.html',
})
export class DhMarketParticipantActorMasterDataComponent
  implements OnChanges, OnDestroy
{
  @Input() actor: ActorDto | undefined;
  @Output() hasChanges = new EventEmitter<ActorChanges>();
  changes: ActorChanges = {
    gln: '',
    status: 'New',
    marketRoles: [],
    meteringPointTypes: [],
  };

  private destroy$ = new Subject<void>();
  allStatuses: WattDropdownOption[] = [];
  statuses: WattDropdownOption[] = [];

  constructor(private translocoService: TranslocoService) {
    this.translocoService
      .selectTranslateObject(
        'marketParticipant.actor.create.masterData.statuses'
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((statusKeys) => {
        this.allStatuses = Object.keys(statusKeys)
          .map((key) => ({
            value: key,
            displayValue: statusKeys[key],
          }))
          .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        this.statuses = this.getValidStatusTransitionOptions(
          this.actor?.status ?? 'New'
        );
      });
  }

  ngOnChanges(): void {
    if (this.actor !== undefined) {
      this.changes = {
        gln: this.actor.gln.value,
        marketRoles: this.actor.marketRoles,
        meteringPointTypes: this.actor.meteringPointTypes,
        status: this.actor.status,
      };
      this.statuses = this.getValidStatusTransitionOptions(this.changes.status);
      this.hasChanges.emit({ ...this.changes });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  readonly onModelChanged = () => {
    this.hasChanges.emit({ ...this.changes });
  };

  private getValidStatusTransitionOptions = (status: ActorStatus) => {
    switch (status) {
      case ActorStatus.New:
        return this.allStatuses.filter((x) =>
          [
            ActorStatus.New.toLowerCase(),
            ActorStatus.Active.toLowerCase(),
            ActorStatus.Deleted.toLocaleLowerCase(),
          ].includes(x.value.toLowerCase())
        );
      case ActorStatus.Active:
      case ActorStatus.Inactive:
      case ActorStatus.Passive:
        return this.allStatuses.filter((x) =>
          [
            ActorStatus.Active.toLowerCase(),
            ActorStatus.Inactive.toLocaleLowerCase(),
            ActorStatus.Passive.toLocaleLowerCase(),
            ActorStatus.Deleted.toLocaleLowerCase(),
          ].includes(x.value.toLowerCase())
        );
      case ActorStatus.Deleted:
        return this.allStatuses.filter((x) =>
          [ActorStatus.Deleted.toLocaleLowerCase()].includes(
            x.value.toLowerCase()
          )
        );
      default:
        return [];
    }
  };
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    FormsModule,
    TranslocoModule,
    WattDropdownModule,
    WattFormFieldModule,
    WattInputModule,
  ],
  exports: [DhMarketParticipantActorMasterDataComponent],
  declarations: [DhMarketParticipantActorMasterDataComponent],
})
export class DhMarketParticipantActorMasterDataComponentScam {}
