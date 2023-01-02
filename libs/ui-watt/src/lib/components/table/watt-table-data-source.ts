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
import { MatTableDataSource } from '@angular/material/table';
import { WattPaginatorComponent } from '../paginator';

/**
 * @see https://material.angular.io/components/table/api#MatTableDataSource
 */
export class WattTableDataSource<T> extends DataSource<T> {
  private dataSource = new MatTableDataSource<T>();
  private _paginator: MatPaginator | WattPaginatorComponent | null = null;

  constructor(data?: T[]) {
    super();
    if (data) this.dataSource.data = data;
  }

  get data() {
    return this.dataSource.data;
  }
  set data(data: T[]) {
    this.dataSource.data = data;
  }

  get filter() {
    return this.dataSource.filter;
  }
  set filter(filter: string) {
    this.dataSource.filter = filter;
  }

  get filteredData() {
    return this.dataSource.filteredData;
  }
  set filteredData(filteredData: T[]) {
    this.dataSource.filteredData = filteredData;
  }

  get paginator() {
    return this._paginator;
  }
  set paginator(paginator: MatPaginator | WattPaginatorComponent | null) {
    this._paginator = paginator;
    this.dataSource.paginator =
      paginator instanceof WattPaginatorComponent
        ? paginator.instance
        : paginator;
  }

  get sort() {
    return this.dataSource.sort;
  }
  set sort(sort: MatTableDataSource<T>['sort']) {
    this.dataSource.sort = sort;
  }

  get filterPredicate() {
    return this.dataSource.filterPredicate;
  }
  set filterPredicate(
    filterPredicate: MatTableDataSource<T>['filterPredicate']
  ) {
    this.dataSource.filterPredicate = filterPredicate;
  }

  get sortData() {
    return this.dataSource.sortData;
  }
  set sortData(sortData: MatTableDataSource<T>['sortData']) {
    this.dataSource.sortData = sortData;
  }

  get sortingDataAccessor() {
    return this.dataSource.sortingDataAccessor;
  }
  set sortingDataAccessor(
    sortingDataAccessor: MatTableDataSource<T>['sortingDataAccessor']
  ) {
    this.dataSource.sortingDataAccessor = sortingDataAccessor;
  }

  connect() {
    return this.dataSource.connect();
  }

  disconnect() {
    this.dataSource.disconnect();
  }
}
