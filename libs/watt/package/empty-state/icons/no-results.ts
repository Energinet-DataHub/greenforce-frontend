import { Component } from '@angular/core';

@Component({
  selector: 'watt-empty-state-no-results',
  template: `
    <svg viewBox="0 0 128 128" fill="none">
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M64 116c28.719 0 52-23.281 52-52S92.719 12 64 12 12 35.281 12 64s23.281 52 52 52Zm0 2c29.823 0 54-24.177 54-54S93.823 10 64 10 10 34.177 10 64s24.177 54 54 54Z"
        clip-rule="evenodd"
      />
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M63.91 65.91 42 87.82l-1.414-1.414 21.91-21.91L40 42l1.414-1.414L63.91 63.082l22.496-22.497L87.82 42 65.325 64.496l21.91 21.91-1.413 1.414-21.91-21.91Z"
        clip-rule="evenodd"
      />
    </svg>
  `,
})
export class WattEmptyStateNoResultsComponent {}
