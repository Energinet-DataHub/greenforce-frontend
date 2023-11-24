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
import { Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoDirective } from '@ngneat/transloco';

import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { MarketParticipantUserHttp } from '@energinet-datahub/dh/shared/domain';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'dh-signup-mitid',
  styleUrls: ['./dh-signup-mitid.component.scss'],
  templateUrl: './dh-signup-mitid.component.html',
  standalone: true,
  imports: [NgIf, TranslocoDirective, WattSpinnerComponent],
})
export class DhSignupMitIdComponent {
  private marketParticipantUserHttp = inject(MarketParticipantUserHttp);
  private config = inject(dhB2CEnvironmentToken);

  isLoading = signal(false);

  redirectToMitIdSignup = () => {
    this.isLoading.set(true);

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
