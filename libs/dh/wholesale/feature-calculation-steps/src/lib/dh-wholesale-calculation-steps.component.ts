import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { WATT_BREADCRUMBS } from "@energinet-datahub/watt/breadcrumbs";
import { WATT_EXPANDABLE_CARD_COMPONENTS } from "@energinet-datahub/watt/expandable-card";
import { WattCardModule } from "@energinet-datahub/watt/card";
import { WattSpinnerModule } from "@energinet-datahub/watt/spinner";

import { BatchGridAreaDto } from "@energinet-datahub/dh/shared/domain";
import { TranslocoModule } from "@ngneat/transloco";
import { WattBadgeModule } from "@energinet-datahub/watt/badge";

import { BatchVm } from "@energinet-datahub/dh/wholesale/feature-search";
import { CommonModule } from "@angular/common";
import { DhSharedUiDateTimeModule } from "@energinet-datahub/dh/shared/ui-date-time";

@Component({
  templateUrl: "./dh-wholesale-calculation-steps.component.html",
  styleUrls: ["./dh-wholesale-calculation-steps.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    WattBadgeModule,
    WattCardModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
    ...WATT_BREADCRUMBS,
    ...WATT_EXPANDABLE_CARD_COMPONENTS
  ]
})
export class DhWholesaleCalculationStepsComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  batch?: BatchVm = this.router.getCurrentNavigation()?.extras.state?.['batch'];
  gridArea?: BatchGridAreaDto = this.router.getCurrentNavigation()?.extras.state?.['gridArea'];

  steps?: unknown[] = undefined;

  ngOnInit(): void {
    if (!this.batch || !this.gridArea) {
      this.router.navigate(['/wholesale/search-batch'], { relativeTo: this.route });
    }

    setTimeout(() => {
      this.steps = [...Array(25).keys()];
    }, 1000);
  }
}
