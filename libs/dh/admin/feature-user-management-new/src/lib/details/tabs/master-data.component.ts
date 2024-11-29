import { Component, input } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhUserDetails } from '@energinet-datahub/dh/admin/data-access-api';
import { WattCardComponent } from '@energinet-datahub/watt/card';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-user-master-data',
  standalone: true,
  template: `<watt-card
    *transloco="let t; read: 'admin.userManagement.tabs.masterData'"
    variant="solid"
  >
    <watt-description-list variant="stack">
      <watt-description-list-item [label]="t('name')" [value]="user().name" />
      <watt-description-list-item [label]="t('email')" [value]="user().email" />
      <watt-description-list-item
        [label]="t('phone')"
        [value]="user().phoneNumber | dhEmDashFallback"
      />
    </watt-description-list>
  </watt-card>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
  ],
})
export class DhUserMasterDataComponent {
  user = input.required<DhUserDetails>();
}
