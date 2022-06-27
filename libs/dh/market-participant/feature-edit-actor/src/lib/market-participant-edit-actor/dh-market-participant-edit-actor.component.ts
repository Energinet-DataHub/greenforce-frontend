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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@rx-angular/template';
import { map, Subject } from 'rxjs';

import {
  ActorChanges,
  ActorContactChanges,
  DhMarketParticipantEditActorDataAccessApiStore,
  MarketRoleChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  dhMarketParticipantActorIdParam,
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';
import { ActorContactDto } from '@energinet-datahub/dh/shared/domain';
import {
  WattButtonModule,
  WattSpinnerModule,
  WattTabsModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';

import { DhMarketParticipantActorContactDataComponentScam } from './contact-data/dh-market-participant-actor-contact-data.component';
import { DhMarketParticipantActorMasterDataComponentScam } from './master-data/dh-market-participant-actor-master-data.component';
import { DhMarketParticipantActorMarketRolesNewComponentScam } from './market-roles-new/dh-market-participant-actor-market-roles-new.component';

@Component({
  selector: 'dh-market-participant-edit-actor',
  templateUrl: './dh-market-participant-edit-actor.component.html',
  styleUrls: ['./dh-market-participant-edit-actor.component.scss'],
  providers: [DhMarketParticipantEditActorDataAccessApiStore],
})
export class DhMarketParticipantEditActorComponent {
  routeParams$ = this.route.params.pipe(
    map((params) => ({
      organizationId: params[dhMarketParticipantOrganizationIdParam] as string,
      actorId: params[dhMarketParticipantActorIdParam] as string,
    }))
  );
  triggerValidationSubject = new Subject<void>();
  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  actor$ = this.store.actor$;
  validation$ = this.store.validation$;
  gridAreas$ = this.store.gridAreas$;
  selectedGridAreas$ = this.store.selectedGridAreas$;
  contacts$ = this.store.contacts$;
  triggerValidation$ = this.triggerValidationSubject.asObservable();

  constructor(
    private store: DhMarketParticipantEditActorDataAccessApiStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.loadInitialData(this.routeParams$);
  }

  readonly onMasterDataChanged = (changes: ActorChanges) => {
    this.store.setMasterDataChanges(changes);
  };

  readonly onMarketRolesChange = (marketRoleChanges: MarketRoleChanges) => {
    this.store.setMarketRoleChanges(marketRoleChanges);
  };

  readonly onContactsChanged = (
    isValid: boolean,
    added: ActorContactChanges[],
    removed: ActorContactDto[]
  ) => {
    this.store.setContactChanges(isValid, added, removed);
  };

  readonly onCancelled = () => {
    this.backToOverview();
  };

  readonly onSaved = () => {
    this.triggerValidationSubject.next();
    this.store.save(this.backToOverview);
  };

  private readonly backToOverview = () => {
    this.router.navigateByUrl(dhMarketParticipantPath);
  };
}

@NgModule({
  imports: [
    LetModule,
    PushModule,
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattTabsModule,
    WattSpinnerModule,
    PushModule,
    DhMarketParticipantActorMasterDataComponentScam,
    DhMarketParticipantActorContactDataComponentScam,
    DhMarketParticipantActorMarketRolesNewComponentScam,
    WattValidationMessageModule,
  ],
  exports: [DhMarketParticipantEditActorComponent],
  declarations: [DhMarketParticipantEditActorComponent],
})
export class DhMarketParticipantEditActorScam {}
