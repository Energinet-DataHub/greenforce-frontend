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
import {
  ActorChanges,
  DhMarketParticipantEditActorDataAccessApiStore,
  MeteringPointTypeChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import { DhMarketParticipantActorMasterDataComponentScam } from './master-data/dh-market-participant-actor-master-data.component';
import { DhMarketParticipantActorMeteringPointTypeComponentScam } from './metering-point-type/dh-market-participant-actor-metering-point-type.component';

import {
  WattButtonModule,
  WattSpinnerModule,
  WattTabsModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dhMarketParticipantActorIdParam,
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';

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
  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  actor$ = this.store.actor$;
  validation$ = this.store.validation$;

  constructor(
    private store: DhMarketParticipantEditActorDataAccessApiStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.getActorAndContacts(this.routeParams$);
  }

  readonly onMasterDataChanged = (changes: ActorChanges) => {
    this.store.setMasterDataChanges(changes);
  };

  readonly onMeteringPointTypeChanged = (changes: MeteringPointTypeChanges) => {
    this.store.setMeteringPoinTypeChanges(changes);
  };

  readonly onCancelled = () => {
    this.backToOverview();
  };

  readonly onSaved = () => {
    this.store.save(this.backToOverview);
  };

  private readonly backToOverview = () => {
    this.router.navigateByUrl(dhMarketParticipantPath);
  };
}

@NgModule({
  imports: [
    LetModule,
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattTabsModule,
    WattSpinnerModule,
    DhMarketParticipantActorMasterDataComponentScam,
    DhMarketParticipantActorMeteringPointTypeComponentScam,
    WattValidationMessageModule,
  ],
  exports: [DhMarketParticipantEditActorComponent],
  declarations: [DhMarketParticipantEditActorComponent],
})
export class DhMarketParticipantEditActorScam {}
