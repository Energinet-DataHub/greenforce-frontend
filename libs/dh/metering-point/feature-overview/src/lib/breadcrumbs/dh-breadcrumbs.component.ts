import { Component, Input } from '@angular/core';
import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';

@Component({
  selector: 'dh-breadcrumbs',
  templateUrl: './dh-breadcrumbs.component.html',
  styleUrls: ['./dh-breadcrumbs.component.scss'],
})
export class DhBreadcrumbsComponent {
  meteringPointAbsolutePath = ['/', dhMeteringPointPath];

  @Input() meteringPointId = '';
}
