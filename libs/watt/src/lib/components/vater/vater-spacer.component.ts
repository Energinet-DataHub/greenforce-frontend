import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vater-spacer, [vater-spacer]',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [
    `
      vater-spacer,
      [vater-spacer] {
        flex: 1;
        align-self: stretch;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterSpacerComponent {}
