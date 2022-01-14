import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabsModule } from '@energinet-datahub/watt';
import { DhIsParentPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

import { DhChargesTabContentScam } from './charges-tab-content/dh-charges-tab-content.component';
import { DhChildMeteringPointsTabContentScam } from './child-metering-points-tab-content/dh-child-metering-points-tab-content.component';

@Component({
  selector: 'dh-metering-point-tabs',
  templateUrl: './dh-metering-point-tabs.template.html',
})
export class DhMeteringPointTabsComponent {
  childMeteringPointsCount = 0;

  meteringPoint$ = this.store.meteringPoint$.pipe(
    tap((meteringPoint) => {
      this.childMeteringPointsCount =
        meteringPoint.childMeteringPoints?.length ?? 0;
    })
  );

  constructor(private store: DhMeteringPointDataAccessApiStore) {}
}

@NgModule({
  declarations: [DhMeteringPointTabsComponent],
  exports: [DhMeteringPointTabsComponent],
  imports: [
    LetModule,
    CommonModule,
    WattTabsModule,
    TranslocoModule,
    DhIsParentPipeScam,
    DhChargesTabContentScam,
    DhChildMeteringPointsTabContentScam,
  ],
})
export class DhMeteringPointTabsScam {}
