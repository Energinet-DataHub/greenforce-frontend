import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { WattTableDataSource } from '../table';

@Injectable()
export class WattDataSourceService<T = unknown> {
  source$ = new ReplaySubject<WattTableDataSource<T>>();

  register(dataSource: WattTableDataSource<T>) {
    this.source$.next(dataSource);
  }
}
