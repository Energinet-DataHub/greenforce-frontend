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
