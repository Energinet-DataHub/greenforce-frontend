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
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import {
  EoCookieBannerComponentComponent,
  EoPopupMessageComponent,
} from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoFooterComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoLandingPageAudienceComponent } from './eo-landing-page-audience.component';
import { EoLandingPageCallToActionComponent } from './eo-landing-page-call-to-action.component';
import { EoLandingPageCompanyComponent } from './eo-landing-page-company.component';
import { EoLandingPageHeaderComponent } from './eo-landing-page-header.component';
import { EoLandingPageHeroComponent } from './eo-landing-page-hero.component';
import { EoLandingPageIntroductionComponent } from './eo-landing-page-introduction.component';
import { EoLandingPageNotificationComponent } from './eo-landing-page-notification.component';
import { EoLandingPageOriginOfEnergyComponent } from './eo-landing-page-origin-of-energy.component';
import { EoLandingPagePresenter } from './eo-landing-page.presenter';
import { EoLandingPageStore } from './eo-landing-page.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EoFooterComponent,
    EoLandingPageAudienceComponent,
    EoLandingPageCallToActionComponent,
    EoLandingPageCompanyComponent,
    EoLandingPageHeaderComponent,
    EoLandingPageHeroComponent,
    EoLandingPageIntroductionComponent,
    EoLandingPageNotificationComponent,
    EoLandingPageOriginOfEnergyComponent,
    EoCookieBannerComponentComponent,
    EoPopupMessageComponent,
    NgIf,
  ],
  selector: 'eo-landing-page-shell',
  styles: [
    `
      :host {
        display: block;
      }

      img {
        display: block;
      }

      .u-positioning-context {
        position: relative !important;
      }

      .u-snap-bottom {
        position: absolute;
        bottom: 0 !important;
      }

      .u-collapse-bottom {
        padding-bottom: 0 !important;
      }

      a {
        color: var(--watt-color-primary);
      }

      .centered {
        margin: 0 auto;
        max-width: 960px;
      }
    `,
  ],
  template: `
    <eo-cookie-banner *ngIf="!cookiesSet" (accepted)="getCookieStatus()"></eo-cookie-banner>
    <eo-landing-page-header></eo-landing-page-header>

    <div class="u-positioning-context">
      <eo-landing-page-notification class="u-collapse-bottom"></eo-landing-page-notification>

      <eo-popup-message
        *ngIf="error"
        class="centered"
        title="{{ error.title }}"
        message="{{ error.message }}"
      ></eo-popup-message>

      <eo-landing-page-hero></eo-landing-page-hero>

      <eo-landing-page-introduction></eo-landing-page-introduction>

      <eo-landing-page-origin-of-energy></eo-landing-page-origin-of-energy>

      <eo-landing-page-audience></eo-landing-page-audience>

      <eo-landing-page-company></eo-landing-page-company>

      <eo-landing-page-call-to-action></eo-landing-page-call-to-action>
    </div>

    <eo-footer></eo-footer>
  `,
  viewProviders: [EoLandingPageStore, EoLandingPagePresenter],
})
export class EoLandingPageShellComponent {
  @HostBinding('style.--eo-landing-page-content-max-width')
  get cssPropertyContentMaxWidth(): string {
    return `${this.presenter.contentMaxWidthPixels}px`;
  }
  cookiesSet: string | null = null;
  error: { title: string; message: string } | null = null;

  constructor(private presenter: EoLandingPagePresenter, private router: Router) {
    this.getCookieStatus();
    this.checkForError();
  }

  getCookieStatus() {
    this.cookiesSet = localStorage.getItem('cookiesAccepted');
  }

  checkForError() {
    this.error = this.router.getCurrentNavigation()?.extras?.state?.error
      ? {
          title: 'An error occurred',
          message: 'There was an error during login. Please try again.',
        }
      : null;
  }
}
