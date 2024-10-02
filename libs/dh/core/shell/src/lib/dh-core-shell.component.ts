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
import { TranslocoPipe } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { DhTopBarStore } from '@energinet-datahub/dh-shared-data-access-top-bar';
import { DhProfileAvatarComponent } from '@energinet-datahub/dh/profile/feature-avatar';
import {
  DhInactivityDetectionService,
  DhSelectedActorComponent,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

import { DhPrimaryNavigationComponent } from './dh-primary-navigation.component';
import { DhNotificationsCenterComponent } from './dh-notifications-center.component';

@Component({
  selector: 'dh-shell',
  styleUrls: ['./dh-core-shell.component.scss'],
  templateUrl: './dh-core-shell.component.html',
  standalone: true,
  imports: [
    TranslocoPipe,
    RouterOutlet,

    WattShellComponent,
    WattIconComponent,

    DhPrimaryNavigationComponent,
    DhProfileAvatarComponent,
    DhSelectedActorComponent,
    DhFeatureFlagDirective,
    DhNotificationsCenterComponent,
  ],
})
export class DhCoreShellComponent {
  private readonly dhTopBarStore = inject(DhTopBarStore);

  titleTranslationKey = toSignal(this.dhTopBarStore.titleTranslationKey$);

  constructor(inactivityDetection: DhInactivityDetectionService) {
    inactivityDetection.trackInactivity();
  }
}
