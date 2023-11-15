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
import { Component, inject } from '@angular/core';

import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { TranslocoModule } from '@ngneat/transloco';
import { MarketParticipantUserHttp } from '@energinet-datahub/dh/shared/domain';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';

@Component({
  selector: 'dh-signup-mitid',
  styleUrls: ['./dh-signup-mitid.component.scss'],
  templateUrl: './dh-signup-mitid.component.html',
  standalone: true,
  imports: [CommonModule, RxPush, WattSpinnerComponent, TranslocoModule],
})
export class DhSignupMitIdComponent {
  private marketParticipantUserHttp = inject(MarketParticipantUserHttp);
  private config = inject(dhB2CEnvironmentToken);

  isLoading$ = new Subject<boolean>();

  redirectToMitIdSignup = () => {
    this.isLoading$.next(true);
    this.marketParticipantUserHttp
      .v1MarketParticipantUserInitiateMitIdSignupPost()
      .subscribe(() => {
        MSALInstanceFactory({
          ...this.config,
          authority: this.config.mitIdInviteFlowUri,
        }).loginRedirect();
      });
  };
}
