import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WattPaginatorIntlService {
  readonly changes: Subject<void> = new Subject<void>();
  description = 'Select page';
  itemsPerPage = 'Results per page';
  nextPage = 'Next page';
  previousPage = 'Previous page';
  firstPage = 'First page';
  lastPage = 'Last page';
  of = 'of';
}
