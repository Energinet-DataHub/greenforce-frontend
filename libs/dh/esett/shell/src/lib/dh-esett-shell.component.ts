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
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';

import { DhOutgoingMessagesComponent } from './outgoing-messages/dh-outgoing-messages.component';

@Component({
  selector: 'dh-esett-shell',
  standalone: true,
  template: `<watt-tabs *transloco="let t; read: 'eSett.tabs'">
    <watt-tab [label]="t('outgoingMessages.tabLabel')">
      <dh-outgoing-messages />
    </watt-tab>
  </watt-tabs>`,
  imports: [TranslocoDirective, WATT_TABS, DhOutgoingMessagesComponent],
})
export class DhESettShellComponent {}
