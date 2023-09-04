import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';

@Component({
  selector: 'dh-esett-shell',
  standalone: true,
  template: `<watt-tabs *transloco="let t; read: 'eSett.tabs'">
    <watt-tab [label]="t('outgoingMessages.tabLabel')">
      <div>Tab 1</div>
    </watt-tab>
  </watt-tabs>`,
  imports: [TranslocoDirective, WATT_TABS],
})
export class DhESettShellComponent {}
