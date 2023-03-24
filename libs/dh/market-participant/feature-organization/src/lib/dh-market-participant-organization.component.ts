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
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { DhMarketParticipantOverviewDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';
import { WattValidationMessageModule } from '@energinet-datahub/watt/validation-message';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { Router } from '@angular/router';
import {
  dhMarketParticipantActorsCreatePath,
  dhMarketParticipantActorsEditPath,
  dhMarketParticipantActorsPath,
  dhMarketParticipantOrganizationsCreatePath,
  dhMarketParticipantOrganizationsEditPath,
  dhMarketParticipantOrganizationsPath,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';
import { DhMarketParticipantOrganizationOverviewScam } from './overview/dh-market-participant-organization-overview.component';
import { PushModule } from '@rx-angular/template/push';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { DhMarketParticipantMarketRolesOverviewComponent } from './market-roles-overview/dh-market-participant-market-roles-overview.component';

@Component({
  selector: 'dh-market-participant-organization',
  styleUrls: ['./dh-market-participant-organization.component.scss'],
  templateUrl: './dh-market-participant-organization.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantOrganizationComponent {
  constructor(
    private store: DhMarketParticipantOverviewDataAccessApiStore,
    private router: Router
  ) {
    this.store.loadOverviewRows();
  }

  isLoading$ = this.store.isLoading$;
  validationError$ = this.store.validationError$;
  overviewList$ = this.store.overviewList$;
  gridAreas$ = this.store.gridAreas$;

  readonly editOrganization = (organizationId: string) => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantOrganizationsPath,
      organizationId,
      dhMarketParticipantOrganizationsEditPath,
    ]);

    this.router.navigateByUrl(url);
  };

  readonly createOrganization = () => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantOrganizationsPath,
      dhMarketParticipantOrganizationsCreatePath,
    ]);

    this.router.navigateByUrl(url);
  };

  readonly createActor = (organizationId: string) => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantOrganizationsPath,
      organizationId,
      dhMarketParticipantActorsPath,
      dhMarketParticipantActorsCreatePath,
    ]);

    this.router.navigateByUrl(url);
  };

  readonly editActor = (organizationId: string, actorId: string) => {
    const url = this.router.createUrlTree([
      dhMarketParticipantPath,
      dhMarketParticipantOrganizationsPath,
      organizationId,
      dhMarketParticipantActorsPath,
      actorId,
      dhMarketParticipantActorsEditPath,
    ]);

    this.router.navigateByUrl(url);
  };
}

@NgModule({
  imports: [
    CommonModule,
    LetModule,
    TranslocoModule,
    WattButtonModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattTabComponent,
    WattTabsComponent,
    WattValidationMessageModule,
    DhMarketParticipantOrganizationOverviewScam,
    DhMarketParticipantMarketRolesOverviewComponent,
    PushModule,
    DhPermissionRequiredDirective,
  ],
  declarations: [DhMarketParticipantOrganizationComponent],
})
export class DhMarketParticipantOrganizationScam {}
