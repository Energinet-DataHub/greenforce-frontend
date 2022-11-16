import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

import { WATT_BREADCRUMBS } from "@energinet-datahub/watt/breadcrumbs";

import { BatchGridAreaDto } from "@energinet-datahub/dh/shared/domain";
import { TranslocoModule } from "@ngneat/transloco";
import { WattBadgeModule } from "@energinet-datahub/watt/badge";

import { BatchVm } from "@energinet-datahub/dh/wholesale/feature-search";

@Component({
  templateUrl: "./dh-wholesale-calculation-steps.component.html",
  styleUrls: ["./dh-wholesale-calculation-steps.component.scss"],
  standalone: true,
  imports: [
    TranslocoModule,
    WattBadgeModule,
    ...WATT_BREADCRUMBS
  ]
})
export class DhWholesaleCalculationStepsComponent {
  router = inject(Router);
  batch?: BatchVm = this.router.getCurrentNavigation()?.extras.state?.['batch'];
  gridArea?: BatchGridAreaDto = this.router.getCurrentNavigation()?.extras.state?.['gridArea'];
}
