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
import { ChangeDetectionStrategy, Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { EoPrimaryNavigationStore } from './eo-primary-navigation.store';

const selector = 'ett-primary-navigation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      /**
       * 1. Add active indicator to the active link.
       * 2. Highlight the active link.
       */

      ${selector} {
        display: block;

        .active-indicator /* [1] */ {
          --size: var(--watt-space-xs);
          display: none;

          width: var(--size);
          height: 100%;
          margin-right: calc(var(--watt-space-m) - var(--size));

          background-color: var(--watt-color-focus);
        }

        a.is-active {
          background-color: var(--watt-color-primary); // [2]
          color: var(--watt-color-primary-contrast); // [2]

          .active-indicator /* [1] */ {
            display: block;
          }

          > .mat-list-item-content.mat-list-item-content /* [1] */ {
            padding-left: 0;
          }
        }
      }
    `,
  ],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="is-active">
        <div class="active-indicator"></div>
        Dashboard
      </a>

      <a mat-list-item href="#0" (click)="onLogOut()"> Log out </a>
    </mat-nav-list>
  `,
  viewProviders: [EoPrimaryNavigationStore],
})
export class EttPrimaryNavigationComponent {
  constructor(private store: EoPrimaryNavigationStore) {}

  onLogOut(): void {
    this.store.onLogOut();
  }
}

@NgModule({
  declarations: [EttPrimaryNavigationComponent],
  exports: [EttPrimaryNavigationComponent],
  imports: [RouterModule, MatListModule],
})
export class EttPrimaryNavigationScam {}
