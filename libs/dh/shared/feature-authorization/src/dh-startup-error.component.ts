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
import { Component, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';
import { VaterStackComponent } from '@energinet/watt/vater';

@Component({
  selector: 'dh-startup-error',
  imports: [TranslocoDirective, VaterStackComponent, WattButtonComponent, WattEmptyStateComponent],
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }

    watt-empty-state {
      width: 80%;
      max-width: 700px;
    }
  `,
  template: `
    <vater-stack
      justify="center"
      align="center"
      fill="vertical"
      *transloco="let t; prefix: 'shared.startupError'"
    >
      <watt-empty-state icon="custom-power" [title]="t('title')" [message]="t('message')">
        <watt-button variant="primary" (click)="onReload()">{{ t('retry') }}</watt-button>
        <watt-button variant="secondary" (click)="onSignOut()">{{ t('signOut') }}</watt-button>
      </watt-empty-state>
    </vater-stack>
  `,
})
export class DhStartupErrorComponent {
  private readonly msalService = inject(MsalService);

  onReload(): void {
    window.location.reload();
  }

  onSignOut(): void {
    this.msalService.instance.logoutRedirect();
  }
}
