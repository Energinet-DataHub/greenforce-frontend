import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabsModule } from '@energinet-datahub/watt/tabs';

@Component({
  selector: 'dh-user-management-tabs',
  standalone: true,
  templateUrl: './dh-user-management-tabs.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [WattTabsModule, TranslocoModule],
})
export class DhUserManagementTabsComponent {}
