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
  template: ` <watt-card
    *transloco="let t; read: 'admin.userManagement.tabs.masterData'"
    variant="solid"
  >
    <watt-description-list variant="stack">
      <watt-description-list-item [label]="t('name')" [value]="role().name" />
      <watt-description-list-item [label]="t('description')" [value]="role().description" />
      <watt-description-list-item
        [label]="t('marketRole')"
        [value]="'marketParticipant.marketRoles.' + this.role().eicFunction | transloco"
      />
    </watt-description-list>
  </watt-card>`,
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
  ],
})
export class DhRoleMasterDataComponent {
  role = input.required<DhUserRoleWithPermissions>();
}
