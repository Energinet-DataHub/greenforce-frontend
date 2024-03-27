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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';

import { EoAnnouncementBarComponent } from './announcement-bar.component';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe } from '@ngneat/transloco';
import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoLanguageSwitcherComponent } from '@energinet-datahub/eo/globalization/feature-language-switcher';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattButtonComponent,
    EoAnnouncementBarComponent,
    TranslocoPipe,
    EoProductLogoDirective,
    EoLanguageSwitcherComponent,
  ],
  selector: 'eo-landing-page-header',
  styles: `
    :host {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 100;

      --watt-button-color: #fff;
      --watt-button-text-transform: uppercase;
    }



    .topbar {
      padding: 24px 99px;
      display: flex;
      justify-content: space-between;
    }

    .logo {
      height: 44px;
      width: 300px;
    }
  `,
  template: `
    <eo-announcement-bar [announcement]="translations.announcementBar.message | transloco" />
    <div class="topbar">
      <img eoProductLogo version="secondary" class="logo" />

      <div class="actions">
        <watt-button variant="text" class="login" data-testid="login-button" (click)="login()">
          Log in
        </watt-button>
        <eo-language-switcher>
          <watt-button variant="text" icon="language" />
        </eo-language-switcher>
      </div>
    </div>
  `,
})
export class EoLandingPageHeaderComponent {
  private authService = inject(EoAuthService);
  protected translations = translations;

  login() {
    this.authService.startLogin();
  }
}
