import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EoActivityLogComponent } from '@energinet-datahub/eo/activity-log';

@Component({
  selector: 'eo-activity-log-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoActivityLogComponent],
  encapsulation: ViewEncapsulation.None,
  template: ` <eo-activity-log /> `,
})
export class EoActivityLogShellComponent {}
