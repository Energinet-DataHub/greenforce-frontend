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
import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@jsverse/transloco';

import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { DhMitIDButtonComponent } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterStackComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-core-login',
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslocoPipe,
    VaterStackComponent,
    WattButtonComponent,
    DhMitIDButtonComponent,
    MatProgressBarModule,
  ],
  styles: [
    `
      datahub-app {
        height: inherit;
      }

      watt-button,
      dh-mitid-button {
        width: 100%;
      }

      watt-button button {
        width: inherit;
      }

      dh-core-login {
        align-items: center;
        background-color: var(--watt-color-neutral-grey-50);
        display: flex;
        justify-content: center;
        min-height: 100%;
        .mat-mdc-progress-bar {
          --mat-progress-bar-active-indicator-color: var(--watt-color-secondary);
          --mat-progress-bar-track-color: var(--watt-color-primary);
        }
      }

      dh-core-login .container {
        background-color: var(--watt-color-neutral-white);
        border-radius: 4px;
        box-shadow:
          0px 4px 18px 3px rgba(46, 50, 52, 0.08),
          0px 1px 6px rgba(11, 60, 93, 0.12);
        display: flex;
        flex-direction: column;
        min-height: 680px;
        padding: 5rem 10rem;
        width: 680px;
      }

      dh-core-login .logo {
        height: 80px;
        margin-bottom: 3rem;
        min-width: 100%;
      }
    `,
  ],
  template: `
    <div class="container">
      <img src="/assets/logo-dark.svg" class="logo" alt="DataHub logo" />

      <vater-stack gap="l">
        @if (!showProgressBar()) {
          <watt-button (click)="login()">{{ 'login.loginWithUsername' | transloco }}</watt-button>
        }

        <dh-mitid-button
          [style.visibility]="showProgressBar() ? 'hidden' : 'visible'"
          mode="login"
          >{{ 'login.loginWithMitID' | transloco }}</dh-mitid-button
        >

        @if (showProgressBar()) {
          <label>
            {{ 'login.linkingMitId' | transloco }}
            <mat-progress-bar mode="determinate" [value]="progressBarValue()" />
          </label>
        }
      </vater-stack>
    </div>
  `,
})
export class DhCoreLoginComponent implements AfterViewInit {
  private activatedRoute = inject(ActivatedRoute);
  private config = inject(dhB2CEnvironmentToken);

  progressBarValue = signal(0);
  showProgressBar = signal(false);

  mitIdButton = viewChild.required(DhMitIDButtonComponent);

  ngAfterViewInit(): void {
    const mitIdRelogin = Boolean(localStorage.getItem('mitIdRelogin'));

    if (mitIdRelogin) {
      this.showProgressBar.set(true);

      setInterval(() => {
        this.progressBarValue.set(this.progressBarValue() + 1);
      }, 200);

      setTimeout(() => {
        localStorage.removeItem('mitIdRelogin');

        this.mitIdButton().redirectToMitIdSignup();
        this.showProgressBar.set(false);
      }, 20_000);
    }
  }

  async login() {
    const instance = MSALInstanceFactory({
      ...this.config,
    });

    const redirectTo = this.activatedRoute.snapshot.queryParams['dhRedirectTo'];

    await instance.initialize();
    await instance.loginRedirect({
      scopes: [this.config.scopeUri],
      redirectStartPage: redirectTo,
    });
  }
}
