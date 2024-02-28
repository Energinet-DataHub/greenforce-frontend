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
import { MatMenuModule } from '@angular/material/menu';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { MsalService } from '@azure/msal-angular';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { DhProfileModalComponent } from '@energinet-datahub/dh/profile/feature-profile-modal';
import { WattModalService } from '@energinet-datahub/watt/modal';

@Component({
  selector: 'dh-profile-avatar',
  standalone: true,
  imports: [MatMenuModule, WattIconComponent, TranslocoDirective],
  encapsulation: ViewEncapsulation.None,
  template: `<button [matMenuTriggerFor]="menu" class="watt-text-m">{{ name() }}</button>
    <mat-menu #menu="matMenu" xPosition="before" class="dh-profile__menu">
      <ng-container *transloco="let transloco; read: 'shell'">
        <button (click)="openProfileModal()" mat-menu-item>
          <watt-icon name="account" class="watt-icon--small" />
          <span>{{ transloco('profile') }}</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <watt-icon name="logout" class="watt-icon--small" />
          <span>{{ transloco('logout') }}</span>
        </button>
      </ng-container>
    </mat-menu>`,
  styleUrls: ['./dh-profile-avatar.component.scss'],
})
export class DhProfileAvatarComponent {
  private readonly _authService = inject(MsalService);
  private readonly _modalService = inject(WattModalService);

  logout() {
    this._authService.logoutRedirect();
  }

  name() {
    return this.getAccount().username.charAt(0).toUpperCase();
  }

  openProfileModal() {
    this._modalService.open({
      component: DhProfileModalComponent,
      data: { email: this.getAccount().username },
    });
  }

  private getAccount() {
    return this._authService.instance.getActiveAccount() ?? { username: '' };
  }
}
