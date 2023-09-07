import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { WattTableDataSource } from '../table';

@Injectable()
export class WattDataSourceService<T = unknown> {
  source$ = new ReplaySubject<WattTableDataSource<T>>();

  constructor() {
    console.log('constructed');
  }

  register(dataSource: WattTableDataSource<T>) {
    console.log('register');
    this.source$.next(dataSource);
  }
}
