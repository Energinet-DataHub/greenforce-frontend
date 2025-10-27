import { Component } from '@angular/core';
import { WattPortal } from '@energinet-datahub/watt/portal';

@Component({
  selector: 'dh-toolbar',
  imports: [WattPortal],
  template: `
    <watt-portal to="toolbar">
      <ng-content />
    </watt-portal>
  `,
})
export class DhToolbarComponent {}
