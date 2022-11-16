import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BatchDtoV2 } from "@energinet-datahub/dh/shared/domain";

@Component({
  templateUrl: "./dh-wholesale-calculation-steps.component.html",
  styleUrls: ["./dh-wholesale-calculation-steps.component.scss"],
  standalone: true
})
export class DhWholesaleCalculationStepsComponent implements OnInit {
  router = inject(Router);
  batch?: BatchDtoV2 = this.router.getCurrentNavigation()?.extras.state?.['batch'];

  ngOnInit(): void {
    console.log(this.batch);
  }

}
