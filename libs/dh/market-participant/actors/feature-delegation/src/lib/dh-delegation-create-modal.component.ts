import { Component } from '@angular/core';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';

@Component({
  selector: 'dh-create-delegation',
  standalone: true,
  template: `<watt-modal> test </watt-modal>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [WATT_MODAL],
})
export class DhDelegationCreateModalComponent {}
