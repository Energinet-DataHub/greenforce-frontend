import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

interface Actor {
  glnOrEic: string;
  name: string;
  marketRole: string;
  status: string;
}

@Component({
  standalone: true,
  selector: 'dh-actors-overview',
  templateUrl: './dh-actors-overview.component.html',
  styleUrls: ['./dh-actors-overview.component.scss'],
  imports: [TranslocoModule, WATT_TABLE, WATT_CARD],
})
export class DhActorsOverviewComponent {
  dataSource = new WattTableDataSource<Actor>([]);

  columns: WattTableColumnDef<Actor> = {
    glnOrEic: { accessor: 'glnOrEic' },
    name: { accessor: 'name' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };
}
