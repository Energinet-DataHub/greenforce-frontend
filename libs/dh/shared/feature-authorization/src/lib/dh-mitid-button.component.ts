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
import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { InitiateMitIdSignupDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-mitid-button',
  imports: [WattSpinnerComponent],
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
  `,
})
export class DhMitIDButtonComponent {
  private activatedRoute = inject(ActivatedRoute);
  private config = inject(dhB2CEnvironmentToken);
  private initiateMitIdSignupMutation = mutation(InitiateMitIdSignupDocument);

  isLoading = signal(false);

  mode = input.required<'signup' | 'login'>();

  redirectToMitIdSignup() {
    this.isLoading.set(true);

    if (this.mode() === 'login') {
      this.redirectToMitID();
    } else {
      this.initiateMitIdSignupMutation.mutate({
        onCompleted: () => this.redirectToMitID(),
      });
    }
  }

  private async redirectToMitID() {
    const instance = MSALInstanceFactory({
      ...this.config,
      authority: this.config.mitIdFlowUri,
    });

    const redirectTo = this.activatedRoute.snapshot.queryParams['dhRedirectTo'];

    await instance.initialize();
    await instance.loginRedirect({
      scopes: [this.config.scopeUri],
      redirectStartPage: redirectTo,
    });
  }
}
