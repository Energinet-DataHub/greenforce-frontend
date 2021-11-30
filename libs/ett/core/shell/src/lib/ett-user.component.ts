/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserProfile } from '@energinet-datahub/ett/auth/data-access-api';
import { WattButtonModule } from '@energinet-datahub/watt';
import { Observable } from 'rxjs';

import { UserStore } from './user.store';

/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
const selector = 'ett-user';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }
    `,
  ],
  template: `
    <ng-container *rxLet="profile$ as profile">
      <ng-container *ngIf="profile">
        <watt-button
          type="text"
          size="normal"
          [disabled]="false"
          [loading]="false"
          [matMenuTriggerFor]="menu"
        >
          {{ profile?.name }}
          <mat-icon aria-hidden="false" aria-label="Profile menu">
            expand_more
          </mat-icon>
        </watt-button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onLogOut()">Logout</button>
        </mat-menu>
      </ng-container>
    </ng-container>
  `,
})
export class EttUserComponent {
  profile$: Observable<UserProfile | null> = this.user.profile$;

  constructor(private user: UserStore) {}

  onLogOut(): void {
    this.user.logOut();
  }
}

@NgModule({
  declarations: [EttUserComponent],
  exports: [EttUserComponent],
  imports: [MatIconModule, MatMenuModule, WattButtonModule],
})
export class EttUserScam {}
