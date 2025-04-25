import { Component } from '@angular/core';

@Component({
  selector: 'dh-circle',
  template: `●`,
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;
    :host {
      @include watt.typography-watt-text-m;
      color: var(--watt-color-neutral-grey-500);
    }
  `,
})
export class DhCircleComponent {}
