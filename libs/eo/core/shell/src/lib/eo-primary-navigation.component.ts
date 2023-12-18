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
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { WattNavListComponent, WattNavListItemComponent } from '@energinet-datahub/watt/shell';

import { EoAuthStore, EoFeatureFlagDirective } from '@energinet-datahub/eo/shared/services';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattNavListComponent, WattNavListItemComponent, EoFeatureFlagDirective],
  selector: 'eo-primary-navigation',
  styles: [
    `
      :host {
        display: grid;
        height: 100%;
        height: calc(100% - 64px);
        grid-template-rows: 1fr auto;
        grid-template-areas:
          'nav'
          'userinfo';
      }

      watt-nav-list {
        display: block;
        grid-area: nav;
        align-self: stretch;
        overflow: auto;
      }

      .userinfo {
        grid-area: userinfo;
        background-color: var(--watt-on-light-low-emphasis);
        border-radius: 8px;
        margin: var(--watt-space-m);
        padding: var(--watt-space-s) var(--watt-space-m);

        p {
          color: var(--watt-on-dark-high-emphasis);

          &.company-name {
            color: var(--watt-on-dark-medium-emphasis);
          }
        }
      }
    `,
  ],
  template: `
    <watt-nav-list>
      <watt-nav-list-item link="{{ routes.dashboard }}" onFeatureFlag="dashboard">
        Dashboard
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.meteringpoints }}" onFeatureFlag="meters">
        Metering Points
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.claims }}"> Claims </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.certificates }}" onFeatureFlag="certificates">
        Certificates
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.transfer }}" onFeatureFlag="certificates">
        Transfers
      </watt-nav-list-item>
    </watt-nav-list>

    <section class="userinfo">
      <p class="watt-label company-name">{{ userInfo()?.cpn }}</p>
      <p class="watt-label">CVR / TIN: {{ userInfo()?.tin }}</p>
      <p class="watt-label">{{ userInfo()?.name }}</p>
    </section>
  `,
})
export class EoPrimaryNavigationComponent implements OnInit {
  private authStore = inject(EoAuthStore);

  protected routes = eoRoutes;
  protected userInfo = signal<{ name: string; cpn: string; tin: string } | null>(null);

  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  ngOnInit(): void {
    this.authStore.getUserInfo$.subscribe((userInfo) => {
      this.userInfo.set({
        name: userInfo.name ?? '',
        cpn: userInfo.cpn ?? '',
        tin: userInfo.tin ?? '',
      });
    });
  }
}
