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
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActorChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { ActorStatus } from '@energinet-datahub/dh/shared/domain';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattDropdownModule, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { Subject, takeUntil } from 'rxjs';
import { getValidStatusTransitionOptions } from './get-valid-status-transition-options';

@Component({
  selector: 'dh-market-participant-actor-master-data',
  styleUrls: ['./dh-market-participant-actor-master-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-actor-master-data.component.html',
})
export class DhMarketParticipantActorMasterDataComponent implements OnChanges, OnDestroy {
  @Input() changes?: ActorChanges;

  private destroy$ = new Subject<void>();
  initialActorStatus?: ActorStatus;
  allStatuses: WattDropdownOption[] = [];
  statuses: WattDropdownOption[] = [];

  constructor(private translocoService: TranslocoService) {
    this.translocoService
      .selectTranslateObject('marketParticipant.actor.create.masterData.statuses')
      .pipe(takeUntil(this.destroy$))
      .subscribe((statusKeys) => {
        this.allStatuses = Object.keys(ActorStatus)
          .map((key) => ({
            value: key,
            displayValue: statusKeys[key] ?? key,
          }))
          .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        this.statuses = getValidStatusTransitionOptions(
          this.initialActorStatus ?? ActorStatus.New,
          this.allStatuses
        );
      });
  }

  ngOnChanges(): void {
    this.initialActorStatus = this.changes?.status;
    this.statuses = getValidStatusTransitionOptions(
      this.initialActorStatus ?? ActorStatus.New,
      this.allStatuses
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
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
