import { Component } from '@angular/core';
import { DhMessageArchiveSearchTableComponent } from './table.component';
import { DhMessageArchiveSearchStartComponent } from './start.component';

@Component({
  selector: 'dh-message-archive-search-page',
  standalone: true,
  imports: [DhMessageArchiveSearchTableComponent, DhMessageArchiveSearchStartComponent],
  template: `
    <dh-message-archive-search-start #start />
    <dh-message-archive-search-table
      [variables]="start.variables()"
      (start)="start.modal().open()"
    />
  `,
})
export class DhMessageArchiveSearchPageComponent {}
