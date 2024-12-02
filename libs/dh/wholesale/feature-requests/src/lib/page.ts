import { Component } from '@angular/core';
import { DhWholesaleRequestsTable } from './table';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-page',
  standalone: true,
  imports: [DhWholesaleRequestsTable],
  template: `<dh-wholesale-requests-table />`,
})
export class DhWholesaleRequestsPage {}
