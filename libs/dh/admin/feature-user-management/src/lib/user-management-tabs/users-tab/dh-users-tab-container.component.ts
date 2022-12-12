import { Component } from '@angular/core';
import { DhUsersTabComponent } from './dh-users-tab.component';

@Component({
  selector: 'dh-users-tab-container',
  standalone: true,
  template: '<dh-users-tab></dh-users-tab>',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [DhUsersTabComponent],
})
export class DhUsersTabContainerComponent {}
