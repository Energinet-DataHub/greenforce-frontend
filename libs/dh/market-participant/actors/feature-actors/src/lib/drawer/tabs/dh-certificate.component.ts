import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-certificate',
  standalone: true,
  template: `
    <watt-card
      variant="solid"
      *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.certificate'"
    >
      <watt-description-list variant="stack">
        <watt-description-list-item
          [label]="t('thumbprint')"
          [value]="undefined | dhEmDashFallback"
        />
        <watt-description-list-item
          [label]="t('expiryDate')"
          [value]="undefined | dhEmDashFallback"
        />
      </watt-description-list>
    </watt-card>
  `,
  imports: [
    TranslocoDirective,
    DhEmDashFallbackPipe,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
  ],
})
export class DhCertificateComponent {}
