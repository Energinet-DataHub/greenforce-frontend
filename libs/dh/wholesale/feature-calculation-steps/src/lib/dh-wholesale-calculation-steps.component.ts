import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";
import { LetModule } from "@rx-angular/template";
import { tap } from "rxjs";

import { DhSharedUiDateTimeModule } from "@energinet-datahub/dh/shared/ui-date-time";
import { WATT_BREADCRUMBS } from "@energinet-datahub/watt/breadcrumbs";
import { WATT_EXPANDABLE_CARD_COMPONENTS } from "@energinet-datahub/watt/expandable-card";
import { WattBadgeModule } from "@energinet-datahub/watt/badge";
import { WattCardModule } from "@energinet-datahub/watt/card";
import { WattEmptyStateModule } from "@energinet-datahub/watt/empty-state";
import { WattSpinnerModule } from "@energinet-datahub/watt/spinner";

import { batch } from "@energinet-datahub/dh/wholesale/domain";
import { GridAreaDto } from "@energinet-datahub/dh/shared/domain";
import { navigateToWholesaleSearchBatch } from "@energinet-datahub/dh/wholesale/routing";
import { DhWholesaleBatchDataAccessApiStore } from "@energinet-datahub/dh/wholesale/data-access-api";

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
    LetModule,
    ...WATT_BREADCRUMBS,
    ...WATT_EXPANDABLE_CARD_COMPONENTS
  ]
})
export class DhWholesaleCalculationStepsComponent implements OnInit {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  batch$ = this.store.selectedBatch$.pipe(tap((batch) => {
    if(!batch) this.store.getBatch(this.route.snapshot.params['batchId']);
  }));
  gridAreaCode?: string = this.route.snapshot.params['gridAreaCode'];

  steps?: unknown[] = undefined;

  ngOnInit(): void {
    setTimeout(() => {
      this.steps = [...Array(25).keys()];
    }, 1000);
  }

  navigateToSearchBatch(batch?: batch): void {
    navigateToWholesaleSearchBatch(this.router, batch?.batchNumber);
  }
}
