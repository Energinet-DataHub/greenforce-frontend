import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WattDataIntlService {
  readonly changes: Subject<void> = new Subject<void>();
  search = 'Search';
  emptyTitle = 'No results found';
  emptyText = 'Try changing the search criteria.';
  emptyRetry = 'Retry';
  errorTitle = 'An unexpected error occured';
  errorText = 'Unfortunately, an error occurred while retrieving the necessary information.';
  defaultTitle = 'An unexpected error occured';
  defaultText = 'Unfortunately, an error occurred while retrieving the necessary information.';
}
