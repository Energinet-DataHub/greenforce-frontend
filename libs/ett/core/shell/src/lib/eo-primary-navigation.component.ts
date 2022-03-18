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
} from '@angular/core';
import { EoLogOutStore } from '@energinet-datahub/ett/auth/data-access-security';
import { WattNavListModule } from '@energinet-datahub/watt';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // We're transitioning to `eo` prefix instead of `ett`
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'eo-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-nav-list>
      <watt-nav-list-item link="/dashboard">Dashboard</watt-nav-list-item>

      <watt-nav-list-item link="/metering-points"
        >Metering points</watt-nav-list-item
      >

      <watt-nav-list-item (click)="onLogOut()" role="link">
        Log out
      </watt-nav-list-item>
    </watt-nav-list>
  `,
  viewProviders: [EoLogOutStore],
})
export class EoPrimaryNavigationComponent {
  @HostBinding('attr.role')
  get roleAttribute(): string {
    return 'navigation';
  }
  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  constructor(private store: EoLogOutStore) {}

  onLogOut(): void {
    this.store.onLogOut();
  }
}

@NgModule({
  declarations: [EoPrimaryNavigationComponent],
  exports: [EoPrimaryNavigationComponent],
  imports: [WattNavListModule],
})
export class EoPrimaryNavigationScam {}
