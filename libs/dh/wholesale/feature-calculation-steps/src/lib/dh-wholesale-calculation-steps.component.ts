import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";

import { DhSharedUiDateTimeModule } from "@energinet-datahub/dh/shared/ui-date-time";
import { WATT_BREADCRUMBS } from "@energinet-datahub/watt/breadcrumbs";
import { WATT_EXPANDABLE_CARD_COMPONENTS } from "@energinet-datahub/watt/expandable-card";
import { WattBadgeModule } from "@energinet-datahub/watt/badge";
import { WattCardModule } from "@energinet-datahub/watt/card";
import { WattEmptyStateModule } from "@energinet-datahub/watt/empty-state";
import { WattSpinnerModule } from "@energinet-datahub/watt/spinner";

import { batch } from "@energinet-datahub/dh/wholesale/domain";
import { BatchGridAreaDto } from "@energinet-datahub/dh/shared/domain";

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
    WattEmptyStateModule,
    DhSharedUiDateTimeModule,
    ...WATT_BREADCRUMBS,
    ...WATT_EXPANDABLE_CARD_COMPONENTS
  ]
})
export class DhWholesaleCalculationStepsComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  batch?: batch = this.router.getCurrentNavigation()?.extras.state?.['batch'];
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
