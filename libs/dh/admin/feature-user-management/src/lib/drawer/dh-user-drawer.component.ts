import { Component, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';

import { WattButtonModule } from '@energinet-datahub/watt/button';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

import { DhTabsComponent } from './tabs/dh-tabs.component';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  styles: [
    `
      h1 {
        margin-top: 0;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    WattDrawerModule,
    WattButtonModule,
    DhTabsComponent,
    WattBadgeComponent,
  ],
})
export class DhUserDrawerComponent {
  @ViewChild('drawer') drawer!: WattDrawerComponent;
  selectedUser: UserOverviewItemDto | null = null;
  onClose() {
    this.drawer.close();
  }
  open(user: UserOverviewItemDto) {
    this.selectedUser = user;
    this.drawer.open();
  }
}
