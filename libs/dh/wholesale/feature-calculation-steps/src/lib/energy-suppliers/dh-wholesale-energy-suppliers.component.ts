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
