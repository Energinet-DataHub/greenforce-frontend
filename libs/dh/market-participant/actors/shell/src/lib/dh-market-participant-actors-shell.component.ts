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
import { Component, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';

@Component({
  selector: 'dh-market-participant-actors-shell',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    dh-market-participant-actors-shell {
      display: block;
    }

    .mat-mdc-tab-nav-bar {
      --mat-tab-header-active-label-text-color: var(--watt-color-neutral-black);
      --mat-tab-header-inactive-label-text-color: var(--watt-on-light-low-emphasis);
    }

    .mat-mdc-tab-header {
      box-shadow: var(--watt-bottom-box-shadow);
      background-color: var(--watt-color-neutral-white);
    }

    .mat-mdc-tab-nav-panel {
      display: block;
      padding: var(--watt-space-ml);
    }

    .mat-mdc-tab-links {
      padding-left: var(--watt-space-ml);
    }

    .mat-mdc-tab-link.mat-mdc-tab-link {
      min-width: 120px;
      opacity: 1;
    }

    .mat-mdc-tab-link .mdc-tab__content {
      @include watt.typography-watt-button;
      color: var(--watt-on-light-medium-emphasis);
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.actors.tabs'">
      <nav mat-tab-nav-bar [mat-stretch-tabs]="false" [tabPanel]="tabPanel">
        <a
          mat-tab-link
          routerLink="/market-participant/actors"
          routerLinkActive
          #rla1="routerLinkActive"
          [active]="rla1.isActive"
        >
          {{ t('actors.tabLabel') }}
        </a>
        <a
          mat-tab-link
          routerLink="/market-participant/organizations"
          routerLinkActive
          #rla2="routerLinkActive"
          [active]="rla2.isActive"
        >
          {{ t('organizations.tabLabel') }}
        </a>
        <a
          mat-tab-link
          routerLink="/market-participant/market-roles"
          routerLinkActive
          #rla3="routerLinkActive"
          [active]="rla3.isActive"
        >
          {{ t('marketRoles.tabLabel') }}
        </a>
      </nav>

      <mat-tab-nav-panel #tabPanel>
        <router-outlet />
      </mat-tab-nav-panel>

      <!-- <watt-tabs>
        <watt-tab [label]="t('actors.tabLabel')">
          <dh-actors-overview />
        </watt-tab>

        <watt-tab [label]="t('organizations.tabLabel')">
          <dh-organizations-overview />
        </watt-tab>

        <watt-tab [label]="t('marketRoles.tabLabel')">
          <dh-market-roles-overview />
        </watt-tab>
      </watt-tabs> -->
    </ng-container>
  `,
  imports: [
    TranslocoDirective,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTabsModule,

    WATT_TABS,
  ],
})
export class DhMarketParticipantActorsShellComponent {}
