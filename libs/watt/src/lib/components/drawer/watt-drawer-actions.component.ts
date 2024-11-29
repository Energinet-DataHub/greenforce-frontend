import { Component } from '@angular/core';

@Component({
  selector: 'watt-drawer-actions',
  standalone: true,
  styles: `
    :host {
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      gap: var(--watt-space-m);
      margin-left: auto;
      margin-right: var(--watt-space-ml);
    }
  `,
  template: `<ng-content select="watt-button" />`,
})
export class WattDrawerActionsComponent {}
