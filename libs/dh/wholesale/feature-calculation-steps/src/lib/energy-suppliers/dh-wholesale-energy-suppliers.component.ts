import { Component, EventEmitter, Output } from '@angular/core';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import {
  WattTableColumnDef,
  WattTableDataSource,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

// replace with generated dto
type EnergySupplier = {
  id: string;
};

const mock: EnergySupplier[] = [
  {
    id: '123456',
  },
  {
    id: '7891011',
  },
];

@Component({
  standalone: true,
  selector: 'dh-wholesale-energy-suppliers',
  imports: [WATT_TABLE, WattPaginatorComponent],
  templateUrl: './dh-wholesale-energy-suppliers.component.html',
  styleUrls: ['./dh-wholesale-energy-suppliers.component.scss'],
})
export class DhWholesaleEnergySuppliersComponent {
  @Output() rowClick = new EventEmitter<EnergySupplier>();
  _dataSource = new WattTableDataSource<EnergySupplier>(mock);
  _columns: WattTableColumnDef<EnergySupplier> = {
    name: { accessor: 'id' },
  };
}
