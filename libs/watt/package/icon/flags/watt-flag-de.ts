import { Component } from '@angular/core';

@Component({
  selector: 'watt-flag-de',
  template: `
    <svg viewBox="0 0 640 480">
      <path fill="#ffce00" d="M0 320h640v160H0z" />
      <path fill="#000001" d="M0 0h640v160H0z" />
      <path fill="red" d="M0 160h640v160H0z" />
    </svg>
  `,
})
export class WattFlagGermanyComponent {}
