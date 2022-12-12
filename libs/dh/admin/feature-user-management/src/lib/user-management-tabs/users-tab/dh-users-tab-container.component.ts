import { Component } from '@angular/core';
import { DhUsersTabComponent } from './dh-users-tab.component';

@Component({
  selector: 'dh-users-tab-container',
  standalone: true,
  templateUrl: 'dh-users-tab-container.component.html',
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
