import { Component } from '@angular/core';

@Component({
  selector: 'watt-field-hint',
  styles: [
    `
      :host {
        color: var(--watt-color-neutral-grey-700);
      }
    `,
  ],
  template: `<ng-content />`,
  standalone: true,
})
export class WattFieldHintComponent {}
