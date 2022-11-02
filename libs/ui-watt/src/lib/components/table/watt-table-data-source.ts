import { MatTableDataSource } from '@angular/material/table';

export class WattTableDataSource<T> extends MatTableDataSource<T> {
  sortingDataAccessor = (data: T, sortHeaderId: string) => {
    if (sortHeaderId in data) {
      const value = (data as Record<string, unknown>)[sortHeaderId];
      if (typeof value === 'string') return value.toLocaleLowerCase();
    }

    return super.sortingDataAccessor(data, sortHeaderId);
  };
}
