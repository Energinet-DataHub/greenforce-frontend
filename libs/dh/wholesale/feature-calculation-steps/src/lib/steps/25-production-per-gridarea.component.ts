/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Component,
  Input,
  ViewChild,
  inject,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';
import { TranslocoModule } from '@ngneat/transloco';

import { batch } from '@energinet-datahub/dh/wholesale/domain';
import { first } from 'rxjs';
import { navigateToWholesaleSearchBatch } from '@energinet-datahub/dh/wholesale/routing';

@Component({
  selector: 'dh-wholesale-production-per-gridarea',
  template: `
    <watt-card (click)="openDetails()">
      <h4>
        <watt-badge>25</watt-badge>
        Aggregeret produktion per netområde
      </h4>
      <watt-button variant="text" icon="openInNew">Åbn</watt-button>
    </watt-card>

    <watt-drawer #drawer>
      <watt-drawer-topbar>
        <watt-breadcrumbs *transloco="let transloco; read: 'wholesale'">
          <watt-breadcrumb (click)="navigateToSearchBatch()">{{
            transloco('searchBatch.topBarTitle')
          }}</watt-breadcrumb>
          <watt-breadcrumb (click)="navigateToSearchBatch(batch?.batchNumber)">{{
            transloco('batchDetails.headline', {
              batchNumber: batch?.batchNumber
            })
          }}</watt-breadcrumb>
          <watt-breadcrumb (click)="drawer.close()">{{
            transloco('calculationSteps.breadcrumb', {
              gridAreaCode: gridAreaCode,
              gridAreaName: transloco('calculationSteps.gridAreaName')
            })
          }}</watt-breadcrumb>
          <watt-breadcrumb>Trin 25</watt-breadcrumb>
        </watt-breadcrumbs>
      </watt-drawer-topbar>

      <watt-drawer-content>
        <ng-container *transloco="let transloco; read: 'wholesale'">
          <h3 class="headline watt-headline-1">
            <watt-badge>Trin 25</watt-badge>
            Aggregeret produktion per netområde
          </h3>
          <p>
            <strong>NETOMRÅDE</strong>
            {{
              transloco('calculationSteps.breadcrumb', {
                gridAreaCode: gridAreaCode,
                gridAreaName: transloco('calculationSteps.gridAreaName')
              })
            }}
          </p>
          <hr />
        </ng-container>
      </watt-drawer-content>
    </watt-drawer>
  `,
  styles: [
    `
      watt-card {
        padding: 0 var(--watt-space-m);
        height: var(--watt-space-xl);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--watt-color-neutral-white);
        cursor: pointer;
      }
      watt-card h4 {
        margin: 0;
        color: var(--watt-color-neutral-black);
      }
      watt-badge {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0;
        font-weight: 700;
        margin-right: var(--watt-space-m);
      }

      .headline {
        margin: 0;
      }

      hr {
        border: none;
        border-bottom: 1px solid var(--watt-color-neutral-grey-300);
      }
    `,
  ],
  standalone: true,
  imports: [
    WattCardModule,
    WattBadgeModule,
    WattButtonModule,
    WattDrawerModule,
    ...WATT_BREADCRUMBS,
    TranslocoModule,
  ],
})
export class DhWholesaleProductionPerGridareaComponent
  implements AfterViewInit
{
  @Input() batch?: batch;
  @Input() gridAreaCode?: string;
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngAfterViewInit(): void {
    const selectedStep = this.route.snapshot.queryParams['step'];
    if (selectedStep) {
      this.drawer.open();
    }
  }

  openDetails(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: 25 },
    });

    this.drawer.open();

    this.drawer.closed.pipe(first()).subscribe(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { step: null },
      });
    });
  }

  navigateToSearchBatch(batchNumber?: string): void {
    navigateToWholesaleSearchBatch(this.router, batchNumber);
  }
}
