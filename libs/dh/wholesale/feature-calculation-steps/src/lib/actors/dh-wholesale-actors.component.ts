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
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import { MarketRole, WholesaleActorDto } from '@energinet-datahub/dh/shared/domain';
import { WattPaginatorComponent, WattPaginator } from '@energinet-datahub/watt/paginator';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'dh-wholesale-actors',
  imports: [
    LetModule,
    TranslocoModule,
    WATT_TABLE,
    WattEmptyStateModule,
    WattPaginatorComponent,
    WattSpinnerModule,
  ],
  templateUrl: './dh-wholesale-actors.component.html',
  styleUrls: ['./dh-wholesale-actors.component.scss'],
})
export class DhWholesaleActorsComponent implements OnInit {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private route = inject(ActivatedRoute);

  @Input() batchId!: string;
  @Input() gridAreaCode!: string;
  @Input() marketRole = MarketRole.EnergySupplier;

  @Output() rowClick = new EventEmitter<WholesaleActorDto>();

  _columns: WattTableColumnDef<WholesaleActorDto> = {
    [this.marketRole]: { accessor: 'gln' },
  };

  actors$ = this.store.actors$.pipe(
    exists(),
    tap((actors) => (this._dataSource.data = actors))
  );
  errorTrigger$ = this.store.loadingActorsErrorTrigger$;

  _dataSource = new WattTableDataSource<WholesaleActorDto>([]);

  ngOnInit() {
    this.store.getActors({
      batchId: this.batchId,
      gridAreaCode: this.gridAreaCode,
      marketRole: this.marketRole,
    });
  }

  getSelectedActor(actors?: WholesaleActorDto[]) {
    if (!actors) return;
    return actors.find((e) => e.gln === this.route.firstChild?.snapshot.params.gln);
  }

  isSelectedActor(current: WholesaleActorDto, active: WholesaleActorDto) {
    return current.gln === active.gln;
  }
}
