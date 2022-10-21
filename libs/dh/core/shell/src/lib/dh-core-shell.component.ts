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
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MsalService } from '@azure/msal-angular';
import { PushModule } from '@rx-angular/template';

import { WattShellComponent } from '@energinet-datahub/watt';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { DhLanguagePickerModule } from '@energinet-datahub/dh/globalization/feature-language-picker';
import { DhTopBarStore } from '@energinet-datahub/dh-shared-data-access-top-bar';

import { DhPrimaryNavigationComponent } from './dh-primary-navigation.component';

@Component({
  selector: 'dh-shell',
  styleUrls: ['./dh-core-shell.component.scss'],
  templateUrl: './dh-core-shell.component.html',
  standalone: true,
  imports: [
    TranslocoModule,
    DhLanguagePickerModule,
    RouterModule,
    PushModule,
    DhPrimaryNavigationComponent,
    WattShellComponent,
    WattButtonModule,
  ],
})
export class DhCoreShellComponent {
  titleTranslationKey$ = this.dhTopBarStore.titleTranslationKey$;

  constructor(
    private authService: MsalService,
    private dhTopBarStore: DhTopBarStore
  ) {}

  logout() {
    this.authService.logout();
  }
}
