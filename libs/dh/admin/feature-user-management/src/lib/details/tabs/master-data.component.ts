import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhUser } from '@energinet-datahub/dh/admin/shared';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-user-master-data',
  standalone: true,
  templateUrl: './master-data.component.html',
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
  user = input.required<DhUser>();
}
