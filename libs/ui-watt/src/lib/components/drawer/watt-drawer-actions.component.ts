import { Component } from '@angular/core';

@Component({
  selector: 'watt-drawer-actions',
  template: `<ng-content select="watt-button"></ng-content>`,
  styleUrls: ['./watt-drawer-actions.component.scss'],
})
export class WattDrawerActionsComponent {}
