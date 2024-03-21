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
import { Component, Input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

@Component({
  imports: [TranslocoDirective, WattBadgeComponent],
  standalone: true,
  selector: 'dh-message-archive-status',
  template: `<ng-container *transloco="let t; read: 'messageArchive.search'">
    @switch (message) {
      @case ('request') {
        <watt-badge type="info">{{ t('sent') }}</watt-badge>
      }
      @case ('response') {
        <watt-badge type="success">{{ t('received') }}</watt-badge>
      }
      @default {
        <watt-badge type="info">{{ message }}</watt-badge>
      }
    }
  </ng-container>`,
})
export class DhMessageArchiveStatusComponent {
  @Input() message?: string | null = null;
}
