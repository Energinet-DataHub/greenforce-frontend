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
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { MsalService } from '@azure/msal-angular';
import { RxPush } from '@rx-angular/template/push';
import { ApolloModule } from 'apollo-angular';

import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhTopBarStore } from '@energinet-datahub/dh-shared-data-access-top-bar';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { DhProfileAvatarComponent } from '@energinet-datahub/dh/profile/feature-avatar';
import { DhLanguagePickerComponent } from '@energinet-datahub/dh/globalization/feature-language-picker';

import {
  DhInactivityDetectionService,
  DhSelectedActorComponent,
  DhSignupMitIdComponent,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhPrimaryNavigationComponent } from './dh-primary-navigation.component';

@Component({
  selector: 'dh-shell',
  styleUrls: ['./dh-core-shell.component.scss'],
  templateUrl: './dh-core-shell.component.html',
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ApolloModule,
    RouterOutlet,
    RxPush,

    DhLanguagePickerComponent,
    DhPrimaryNavigationComponent,
    DhProfileAvatarComponent,
    WattShellComponent,
    WattButtonComponent,
    DhSelectedActorComponent,
    DhSignupMitIdComponent,
  ],
})
export class DhCoreShellComponent {
  private readonly authService = inject(MsalService);
  private readonly dhTopBarStore = inject(DhTopBarStore);
  public readonly dhFeatureFlagsService = inject(DhFeatureFlagsService);

  titleTranslationKey$ = this.dhTopBarStore.titleTranslationKey$;

  constructor(inactivityDetection: DhInactivityDetectionService) {
    inactivityDetection.trackInactivity();
  }

  logout() {
    this.authService.logoutRedirect();
  }
}
