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
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MsalService } from '@azure/msal-angular';
import { PushModule } from '@rx-angular/template';

import { WattButtonModule, WattShellComponent } from '@energinet-datahub/watt';
import { DhLanguagePickerModule } from '@energinet-datahub/dh/globalization/feature-language-picker';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';
import { DhTopBarStore } from '@energinet-datahub/dh/shared/util-top-bar';

import { DhPrimaryNavigationScam } from './dh-primary-navigation.component';

@Component({
  selector: 'dh-shell',
  styleUrls: ['./dh-core-shell.component.scss'],
  templateUrl: './dh-core-shell.component.html',
})
export class DhCoreShellComponent {
  titleTranslationKey$ = this.dhTopBarStore.titleTranslationKey$;

  constructor(
    private authService: MsalService,
    private insights: DhApplicationInsights,
    private dhTopBarStore: DhTopBarStore
  ) {
    this.insights.trackException(
      new Error('[TEST] logged exception from shell component constructor'),
      3
    );
  }

  logout() {
    this.insights.trackException(
      new Error('[TEST] logged exception from shell component on logout'),
      3
    );
    this.authService.logout();
  }
}

@NgModule({
  declarations: [DhCoreShellComponent],
  imports: [
    TranslocoModule,
    DhLanguagePickerModule,
    RouterModule,
    PushModule,
    DhPrimaryNavigationScam,
    WattShellComponent,
    WattButtonModule,
  ],
})
export class DhCoreShellScam {}
