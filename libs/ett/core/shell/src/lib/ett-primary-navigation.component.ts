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
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

import { EoLogOutStore } from '@energinet-datahub/ett/auth/data-access-security';
import { RouterModule } from '@angular/router';
import { WattNavListModule } from '@energinet-datahub/watt';

const selector = 'ett-primary-navigation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }
    `,
  ],
  template: `
    <watt-nav-list>
      <watt-nav-list-item link="/dashboard">
        Dashboard
      </watt-nav-list-item>
      <watt-nav-list-item link="/metering-points">
        Metering points
      </watt-nav-list-item>
      <watt-nav-list-item (click)="onLogOut($event)">
        Log out
      </watt-nav-list-item>
    </watt-nav-list>
  `,
  viewProviders: [EoLogOutStore],
})
export class EttPrimaryNavigationComponent {
  @HostBinding('attr.role')
  get roleAttribute(): string {
    return 'navigation';
  }
  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  constructor(private store: EoLogOutStore) {}

  onLogOut(event: Event): void {
    this.store.onLogOut();
  }
}

@NgModule({
  declarations: [EttPrimaryNavigationComponent],
  exports: [EttPrimaryNavigationComponent],
  imports: [WattNavListModule, RouterModule],
})
export class EttPrimaryNavigationScam {}
