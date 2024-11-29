import { Component } from '@angular/core';

@Component({
  selector: 'watt-drawer-content',
  template: `<ng-content />`,
  styles: [
    `
      :host {
        overflow: auto;
      }
    `,
  ],
  standalone: true,
})
export class WattDrawerContentComponent {}
