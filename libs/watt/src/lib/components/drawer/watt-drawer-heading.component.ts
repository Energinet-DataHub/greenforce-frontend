import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'watt-drawer-heading',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  styles: [
    `
      watt-drawer-heading {
        margin-left: var(--watt-space-ml);
      }

      watt-drawer-heading h1,
      watt-drawer-heading h2,
      watt-drawer-heading h3,
      watt-drawer-heading h4,
      watt-drawer-heading h5,
      watt-drawer-heading h6 {
        margin: 0;
        line-height: 48px !important; /* align with actions */
      }
    `,
  ],
  standalone: true,
})
export class WattDrawerHeadingComponent {}
