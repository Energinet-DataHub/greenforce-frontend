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
import { AfterContentInit, Component, inject, input, signal } from '@angular/core';

import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { MarketParticipantUserHttp } from '@energinet-datahub/dh/shared/domain';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  selector: 'dh-mitid-button',
  standalone: true,
  imports: [WattSpinnerComponent, WattButtonComponent, DhFeatureFlagDirective],
  styles: [
    `
      watt-button {
        padding: 16px 0 0 0;
      }

      .mitid-link {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--mitid-color);
        color: var(--watt-on-dark-high-emphasis);
        border-radius: 4px;
        height: 44px;
        padding: 0 1rem;
        text-decoration: none;

        &:hover {
          background-color: var(--mitid-color-hover);
        }

        &:active {
          background-color: var(--mitid-color);
        }
      }

      .mitid-label {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
      }

      watt-spinner {
        --watt-spinner-circle-color: var(--watt-color-neutral-white);
      }
    `,
  ],
  template: `
    <a class="mitid-link" (click)="redirectToMitIdSignup()" tabindex="0">
      @if (isLoading()) {
        <watt-spinner [diameter]="24" />
      } @else {
        <span class="mitid-label">
          <ng-content />
        </span>
      }
    </a>

    @if (hasReset) {
      <ng-container *dhFeatureFlag="'new-login-flow'">
        <watt-button (click)="resetMitId()">Fjern MitID tilknytning</watt-button>
      </ng-container>
    }
  `,
})
export class DhMitIDButtonComponent implements AfterContentInit {
  private marketParticipantUserHttp = inject(MarketParticipantUserHttp);
  private config = inject(dhB2CEnvironmentToken);

  isLoading = signal(false);
  hasReset = false;

  mode = input.required<'signup' | 'login'>();

  redirectToMitIdSignup() {
    this.isLoading.set(true);

    if (this.mode() === 'login') {
      this.redirectToMitID();
    } else {
      this.marketParticipantUserHttp
        .v1MarketParticipantUserInitiateMitIdSignupPost()
        .subscribe(() => this.redirectToMitID());
    }
  }

  resetMitId() {
    this.marketParticipantUserHttp.v1MarketParticipantUserResetMitIdPost().subscribe();
  }

  ngAfterContentInit(): void {
    this.hasReset = this.mode() === 'signup';
  }

  private async redirectToMitID() {
    const instance = MSALInstanceFactory({
      ...this.config,
      authority: this.config.mitIdFlowUri,
    });

    await instance.initialize();
    await instance.loginRedirect();
  }
}
