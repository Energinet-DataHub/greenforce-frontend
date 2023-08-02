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
import { Component } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import {
  DhMarketParticipantGridAreaOverviewDataAccessApiStore,
  DhMarketParticipantGridAreaDataAccessApiStore,
  GridAreaChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { DhMarketParticipantGridAreaOverviewComponent } from './overview/dh-market-participant-gridarea-overview.component';

@Component({
  selector: 'dh-grid-areas-shell',
  styleUrls: ['./dh-grid-areas-shell.component.scss'],
  templateUrl: './dh-grid-areas-shell.component.html',
  providers: [
    DhMarketParticipantGridAreaOverviewDataAccessApiStore,
    DhMarketParticipantGridAreaDataAccessApiStore,
  ],
  standalone: true,
  imports: [
    CommonModule,
    RxLet,
    TranslocoModule,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    DhMarketParticipantGridAreaOverviewComponent,
    RxPush,
  ],
})
export class DhGridAreasShellComponent {
  constructor(
    private store: DhMarketParticipantGridAreaOverviewDataAccessApiStore,
    private gridAreaEditStore: DhMarketParticipantGridAreaDataAccessApiStore
  ) {
    this.store.init();
  }

  isLoading$ = this.store.isLoading$;
  validationError$ = this.store.validationError$;
  rows$ = this.store.rows$;
  isLoadingAuditLog$ = this.gridAreaEditStore.isLoadingAuditLog$;
  auditLog$ = this.gridAreaEditStore.auditLog$;

  gridAreaChangesIsLoading$ = this.gridAreaEditStore.isLoading$;

  onGridAreaChanged = (changes: { gridAreaChanges: GridAreaChanges; onCompleted: () => void }) => {
    this.gridAreaEditStore.saveGridAreaChanges(changes);
  };

  getGridAreaData = (gridAreaId: string) => this.gridAreaEditStore.getAuditLog(gridAreaId);
}
