//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, HostBinding, inject, OnInit } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattNavListComponent, WattNavListItemComponent } from '@energinet-datahub/watt/shell';

import { translations } from '@energinet-datahub/eo/translations';
import { EoActorService } from '@energinet-datahub/eo/auth/data-access';
import { Actor } from '@energinet-datahub/eo/auth/domain';
import { EoActorMenuComponent } from '@energinet-datahub/eo/auth/ui-actor-menu';
import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { EoConsentService } from '@energinet-datahub/eo/consent/data-access-api';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattNavListComponent, WattNavListItemComponent, TranslocoPipe, EoActorMenuComponent],
  selector: 'eo-primary-navigation',
  styles: [
    `
      $height: calc(100% - 64px);
      $height-with-beta-badge: calc(100% - 128px);
      $height-with-trial-badge: calc(100% - 192px);

      :host {
        display: grid;
        height: 100%;
        height: $height-with-beta-badge;
        grid-template-rows: 1fr auto;
        grid-template-areas:
          'nav'
          'userinfo';
      }

      :host.has-trial-badge {
        height: $height-with-trial-badge;
      }

      watt-nav-list {
        display: block;
        grid-area: nav;
        align-self: stretch;
        overflow: auto;
      }

      .trial-badge {
        position: fixed;
        top: 128px;
        left: 0;
        right: 0;
        background-color: #ff6b35;
        color: white;
        text-align: center;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
      }
    `,
  ],
  template: `
    @if (isTrialUser()) {
      <div class="trial-badge">
        {{ translations.topbar.trial.message | transloco }}
      </div>
    }

    <watt-nav-list>
      <watt-nav-list-item link="{{ routes.dashboard }}">
        {{ translations.sidebar.dashboard | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.meteringpoints }}">
        {{ translations.sidebar.meteringPoints | transloco }}
      </watt-nav-list-item>
      @if (isSelf()) {
        <watt-nav-list-item link="{{ routes.claims }}">
          {{ translations.sidebar.claims | transloco }}
        </watt-nav-list-item>
      }
      <watt-nav-list-item link="{{ routes.certificates }}">
        {{ translations.sidebar.certificates | transloco }}
      </watt-nav-list-item>
      <watt-nav-list-item link="{{ routes.transfer }}">
        {{ translations.sidebar.transfers | transloco }}
      </watt-nav-list-item>
      @if (isSelf()) {
        <watt-nav-list-item link="{{ routes.consent }}">
          {{ translations.sidebar.consent | transloco }}
        </watt-nav-list-item>
        <watt-nav-list-item link="{{ routes.activityLog }}">
          {{ translations.sidebar.activityLog | transloco }}
        </watt-nav-list-item>
        <watt-nav-list-item link="{{ routes.reports }}">
          {{ translations.sidebar.reports | transloco }}
        </watt-nav-list-item>
      }
    </watt-nav-list>

    <eo-actor-menu
      [actors]="actors()"
      [currentActor]="currentActor()"
      [self]="self"
      (actorSelected)="onActorSelected($event)"
    />
  `,
})
export class EoPrimaryNavigationComponent implements OnInit {
  @HostBinding('attr.aria-label')
  get ariaLabelAttribute(): string {
    return 'Menu';
  }

  @HostBinding('class.has-trial-badge')
  get hasTrialBadge(): boolean {
    return this.isTrialUser();
  }

  private readonly actorService = inject(EoActorService);
  private readonly consentService = inject(EoConsentService);
  private readonly authService = inject(EoAuthService);

  protected routes = eoRoutes;
  protected translations = translations;

  protected currentActor = this.actorService.actor;
  protected actors = this.actorService.actors;
  protected self = this.actorService.self;
  protected isSelf = this.actorService.isSelf;

  ngOnInit(): void {
    this.consentService.getReceivedConsents().subscribe((receivedConsents) => {
      const actorsOfReceivedConsents: Actor[] = receivedConsents.map((org) => ({
        tin: org.tin,
        org_id: org.organizationId,
        org_name: org.organizationName,
        org_status: org.organizationStatus,
      }));
      this.actorService.setActors([this.self, ...actorsOfReceivedConsents]);
    });
  }

  onActorSelected(selectedActor: Actor) {
    this.actorService.setCurrentActor(selectedActor);
    location.reload();
  }

  protected isTrialUser(): boolean {
    const user = this.authService.user();
    return user?.profile?.org_status === 'trial';
  }
}
