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
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import { MarketRole, WholesaleActorDto } from '@energinet-datahub/dh/shared/domain';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import {
  WattTableColumnDef,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

@Component({
  standalone: true,
  selector: 'dh-wholesale-energy-suppliers',
  imports: [
    LetModule,
    TranslocoModule,
    WATT_TABLE,
    WattEmptyStateModule,
    WattPaginatorComponent,
    WattSpinnerModule,
  ],
  templateUrl: './dh-wholesale-energy-suppliers.component.html',
  styleUrls: ['./dh-wholesale-energy-suppliers.component.scss'],
})
export class DhWholesaleEnergySuppliersComponent implements OnInit {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private route = inject(ActivatedRoute);

  @Input() batchId!: string;
  @Input() gridAreaCode!: string;

  @Output() rowClick = new EventEmitter<WholesaleActorDto>();

  _columns: WattTableColumnDef<WholesaleActorDto> = {
    energySupplier: { accessor: 'gln' },
  };

  actors$ = this.store.actors$;
  errorTrigger$ = this.store.loadingActorsErrorTrigger$;

  _dataSource = (data?: WholesaleActorDto[]) =>
    new WattTableDataSource<WholesaleActorDto>(data);

  ngOnInit() {
    this.store.getActors({
      batchId: this.batchId,
      gridAreaCode: this.gridAreaCode,
      marketRole: MarketRole.EnergySupplier
    });
  }

  getSelectedActor(actors?: WholesaleActorDto[]) {
    if (!actors) return;
    return actors.find(
      (e) => e.gln === this.route.firstChild?.snapshot.params.gln
    );
  }

  isSelectedActor(
    current: WholesaleActorDto,
    active: WholesaleActorDto
  ) {
    return current.gln === active.gln;
  }
}
