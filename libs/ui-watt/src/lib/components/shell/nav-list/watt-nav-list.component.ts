import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { WattNavListItemScam } from './watt-nav-list-item.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-nav-list',
  styleUrls: ['./watt-nav-list.component.scss'],
  template: `<mat-nav-list><ng-content></ng-content></mat-nav-list>`,
})
export class WattNavListComponent {}

@NgModule({
  declarations: [WattNavListComponent],
  exports: [WattNavListComponent, WattNavListItemScam],
  imports: [MatListModule],
})
export class WattNavListModule {}
