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
import { Component, inject } from '@angular/core';
import { DhMarketParticipantEditOrganizationDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { RxLet } from '@rx-angular/template/let';
import { DhMarketParticipantOrganizationMasterDataComponent } from './master-data/dh-market-participant-organization-master-data.component';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantOrganizationsPath,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';

@Component({
  selector: 'dh-market-participant-edit-organization',
  templateUrl: './dh-market-participant-edit-organization.component.html',
  styleUrls: ['./dh-market-participant-edit-organization.component.scss'],
  providers: [DhMarketParticipantEditOrganizationDataAccessApiStore],
  standalone: true,
  imports: [
    RxLet,
    CommonModule,
    TranslocoModule,
    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattSpinnerComponent,
    DhMarketParticipantOrganizationMasterDataComponent,
    WattValidationMessageComponent,
  ],
})
export class DhMarketParticipantEditOrganizationComponent {
  private store = inject(DhMarketParticipantEditOrganizationDataAccessApiStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  organizationId$ = this.route.params.pipe(
    map((params) => params[dhMarketParticipantOrganizationIdParam] as string)
  );

  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  changes$ = this.store.changes$;
  validation$ = this.store.validation$;

  constructor() {
    this.store.getOrganizationAndContacts(this.organizationId$);
  }

  readonly onCancelled = () => {
    this.backToOverview();
  };

  readonly onSaved = () => {
    this.store.save(this.backToOverview);
  };

  private readonly backToOverview = () => {
    this.router.navigateByUrl(`${dhMarketParticipantPath}/${dhMarketParticipantOrganizationsPath}`);
  };
}
