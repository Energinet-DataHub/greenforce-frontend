import { Component } from '@angular/core';

@Component({
  selector: 'watt-flag-pl',
  template: `
    <svg viewBox="0 0 640 480">
      <g fill-rule="evenodd">
        <path fill="#fff" d="M640 480H0V0h640z" />
        <path fill="#dc143c" d="M640 480H0V240h640z" />
      </g>
    </svg>
  `,
})
export class WattFlagPolandComponent {}
