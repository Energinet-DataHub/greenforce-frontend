import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface IWattTableDataSource<T> extends DataSource<T> {
  data: T[];
  filter: string;
  filteredData: T[];
  paginator: MatPaginator | null;
  sort: MatSort | null;
  totalCount: number;
}

/**
 * @see https://material.angular.io/components/table/api#MatTableDataSource
 */
export class WattTableDataSource<T>
  extends MatTableDataSource<T>
  implements IWattTableDataSource<T>
{
  constructor(
    initialData?: T[],
    config: { disableClientSideSort: boolean } = { disableClientSideSort: false }
  ) {
    super(initialData);

    if (config.disableClientSideSort)
      this.sortData = (data: T[]): T[] => {
        return data;
      };
  }

  get totalCount() {
    return this.data.length;
  }
}
