import { Component, input } from '@angular/core';

@Component({
  selector: 'dh-metering-point-overview',
  template: `<p>Metering point ID: {{ meteringPointId() }}</p> `,
})
export class DhMeteringPointOverviewComponent {
  meteringPointId = input<string>();
}
