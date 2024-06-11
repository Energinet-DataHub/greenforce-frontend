import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'watt-status-indicator',
  template: `<div class="status-ind indicator-{{ status() }}"></div>`,
  styles: [
    `
      .status-ind {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .indicator-green {
        background-color: green;
      }
      .indicator-yellow {
        background-color: yellow;
      }
      .indicator-red {
        background-color: red;
      }
    `,
  ],
})
export class WattStatusIndicatorComponent {
  status = input.required<'green' | 'yellow' | 'red' | 'green'>();
}
