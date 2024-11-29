import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'watt-field-error',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-field-error {
        color: var(--watt-color-state-danger);
      }
    `,
  ],
  standalone: true,
})
export class WattFieldErrorComponent {}
