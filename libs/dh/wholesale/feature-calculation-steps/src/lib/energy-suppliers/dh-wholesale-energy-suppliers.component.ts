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
import { BatchActorDto } from '@energinet-datahub/dh/shared/domain';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import {
  WattTableColumnDef,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

@Component({
  standalone: true,
  selector: 'dh-wholesale-energy-suppliers',
  imports: [WATT_TABLE, WattPaginatorComponent],
  templateUrl: './dh-wholesale-energy-suppliers.component.html',
  styleUrls: ['./dh-wholesale-energy-suppliers.component.scss'],
})
export class DhWholesaleEnergySuppliersComponent implements OnInit {
  private store = inject(DhWholesaleBatchDataAccessApiStore);

  @Input() batchId!: string;
  @Input() gridAreaCode!: string;

  @Output() rowClick = new EventEmitter<BatchActorDto>();
  _dataSource = new WattTableDataSource<BatchActorDto>();
  _columns: WattTableColumnDef<BatchActorDto> = {
    name: { accessor: 'gln' },
  };

  energySuppliersForConsumption$ = this.store.energySuppliersForConsumption$;

  ngOnInit() {
    this.energySuppliersForConsumption$.subscribe((energySupplier) => {
      if (energySupplier) {
        this._dataSource.data = energySupplier;
      }
    });
    this.store.getEnergySuppliersForConsumption({
      batchId: this.batchId,
      gridAreaCode: this.gridAreaCode,
    });
  }
}
