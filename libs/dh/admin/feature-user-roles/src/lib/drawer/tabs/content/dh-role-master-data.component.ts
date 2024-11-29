import { Component, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhUserRoleWithPermissions } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-role-master-data',
  standalone: true,
  templateUrl: './dh-role-master-data.component.html',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
  ],
})
export class DhRoleMasterDataComponent {
  role = input<DhUserRoleWithPermissions | null>(null);
}
