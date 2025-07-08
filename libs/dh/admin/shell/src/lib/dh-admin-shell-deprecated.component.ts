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
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-admin-shell-deprecated',
  imports: [
    RouterLink,
    TranslocoDirective,
    WATT_CARD,

    VaterUtilityDirective,
    WattEmptyStateComponent,
    WattButtonComponent,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-card vater inset="ml" *transloco="let t; read: 'admin'">
      <watt-empty-state [title]="t('newPageLine1')" [message]="t('newPageLine2')">
        <watt-button variant="primary" [routerLink]="'/admin/users'">{{
          t('newPageLink')
        }}</watt-button>
      </watt-empty-state>
    </watt-card>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhAdminShellDeprecated {}
