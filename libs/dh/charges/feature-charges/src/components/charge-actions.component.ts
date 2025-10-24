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
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { TranslocoDirective } from '@jsverse/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-charge-actions',
  imports: [MatMenuModule, TranslocoDirective, WattButtonComponent, WattIconComponent],
  template: `
    <ng-container *transloco="let t; prefix: 'charges.charge.actions'">
      <watt-button variant="secondary" [matMenuTriggerFor]="menu">
        {{ t('actionsButton') }}
        <watt-icon name="plus" />
      </watt-button>
      <mat-menu #menu="matMenu" />
    </ng-container>
  `,
})
export class DhChargeActionsComponent {}
