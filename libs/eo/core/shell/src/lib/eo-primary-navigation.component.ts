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
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattNavListComponent, WattNavListItemComponent } from '@energinet-datahub/watt/shell';
import { translations } from '@energinet-datahub/eo/translations';

import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { EoActorMenuComponent } from '@energinet-datahub/eo/auth/ui-actor-menu';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { EoAccountMenuComponent } from './eo-account-menu';
import { is } from 'date-fns/locale';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattNavListComponent,
    WattNavListItemComponent,
    TranslocoPipe,
    EoAccountMenuComponent,
    EoActorMenuComponent,
  ],
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
    `,
  ],
  template: `
    <watt-nav-list>
      <watt-nav-list-item link="{{ routes.dashboard }}">
        {{ translations.sidebar.dashboard | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.meteringpoints }}">
        {{ translations.sidebar.meteringPoints | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.claims }}">
        {{ translations.sidebar.claims | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.certificates }}">
        {{ translations.sidebar.certificates | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.transfer }}">
        {{ translations.sidebar.transfers | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.consent }}">
        {{ translations.sidebar.consent | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.activityLog }}">
        {{ translations.sidebar.activityLog | transloco }}
      </watt-nav-list-item>
    </watt-nav-list>

    <eo-actor-menu
      [actors]="organizations"
      [currentActor]="currentActor"
      (actorSelected)="onActorSelected($event)"
    />
  `,
})
export class EoPrimaryNavigationComponent {
  protected user = inject(EoAuthService).user;

  protected routes = eoRoutes;
  protected translations = translations;

  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  // TODO: Implement this when backend is ready #3280
  protected organizations = [];
  protected currentActor = {name: this.user()?.org_name, tin: this.user()?.org_cvr, org_name: this.user()?.org_name};

  // TODO: Implement this when backend is ready #3280
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onActorSelected(event: unknown) {}
}
