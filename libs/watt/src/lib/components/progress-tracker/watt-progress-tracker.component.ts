import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { VaterStackComponent } from '../vater/vater-stack.component';

@Component({
  imports: [VaterStackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  selector: 'watt-progress-tracker',
  styles: [
    `
      watt-progress-tracker {
        display: block;
      }
    `,
  ],
  template: `<vater-stack direction="row"><ng-content /></vater-stack>`,
})
export class WattProgressTrackerComponent {}
