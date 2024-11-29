import { Component } from '@angular/core';

import { DhMessageArchiveSearchFormService } from './form.service';
import { DhMessageArchiveSearchDetailsComponent } from './details.component';
import { DhMessageArchiveSearchStartComponent } from './start.component';
import { DhMessageArchiveSearchTableComponent } from './table.component';

@Component({
  selector: 'dh-message-archive-search-page',
  standalone: true,
  providers: [DhMessageArchiveSearchFormService],
  imports: [
    DhMessageArchiveSearchDetailsComponent,
    DhMessageArchiveSearchStartComponent,
    DhMessageArchiveSearchTableComponent,
  ],
  template: `
    <dh-message-archive-search-details #details (close)="table.clearSelection()" />
    <dh-message-archive-search-start #start (start)="table.fetch($event)" />
    <dh-message-archive-search-table #table (open)="details.open($event)" (new)="start.open()" />
  `,
})
export class DhMessageArchiveSearchPageComponent {}
