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
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { EoLogOutStore } from '@energinet-datahub/eo/auth/data-access-security';
import { EoFeatureFlagDirective } from '@energinet-datahub/eo/shared/services';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { WattNavListComponent, WattNavListItemComponent } from '@energinet-datahub/watt/shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattNavListComponent, WattNavListItemComponent, EoFeatureFlagDirective],
  selector: 'eo-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }

      .menu-spacer {
        height: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <watt-nav-list>
      <watt-nav-list-item link="{{ routes.dashboard }}" onFeatureFlag="dashboard">
        Dashboard
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.production }}" onFeatureFlag="production">
        Production
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.meteringpoints }}" onFeatureFlag="meters">
        Metering Points
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.certificates }}" onFeatureFlag="certificates"
        >Certificates
        <span style="padding-left:8px; font-weight:bold;color:var(--watt-color-secondary-dark);"
          >BETA</span
        >
      </watt-nav-list-item>
      <div class="menu-spacer"></div>
      <watt-nav-list-item link="{{ routes.help }}">Help</watt-nav-list-item>
      <watt-nav-list-item (click)="onLogOut()" role="link"> Log out </watt-nav-list-item>
    </watt-nav-list>
  `,
  viewProviders: [EoLogOutStore],
})
export class EoPrimaryNavigationComponent {
  routes = eoRoutes;

  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  constructor(private store: EoLogOutStore) {}

  onLogOut(): void {
    this.store.onLogOut();
  }
}
