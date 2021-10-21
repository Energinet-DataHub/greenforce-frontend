import { Component, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';

import { WattTabComponent } from './tab/tab.component';

/**
 * Usage:
 * `import WattTabsModule from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
  encapsulation: ViewEncapsulation.None
})
export class WattTabsComponent {
  @ContentChildren(WattTabComponent)
  public readonly tabElements: QueryList<WattTabComponent> = new QueryList<WattTabComponent>();
}
