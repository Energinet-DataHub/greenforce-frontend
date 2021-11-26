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
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  AuthOidcHttp,
  GetProfileResponse,
  UserProfile,
} from '@energinet-datahub/ett/auth/data-access-api';
import { WattShellModule } from '@energinet-datahub/watt';
import { WattButtonModule } from '@energinet-datahub/watt';
import { MatIconModule } from '@angular/material/icon'; // TODO Import from Watt?
import { MatMenuModule } from '@angular/material/menu'; // TODO Import from Watt?
import { map } from 'rxjs';

import { EttPrimaryNavigationScam } from './ett-primary-navigation.component';
import { CommonModule } from '@angular/common';

const selector = 'ett-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      ${selector}__toolbar {
          width: 100%;
          display: flex;
      }

      ${selector}__toolbar h1 {
          flex: auto;
      }

      ${selector}__toolbar .menu {
          align-self: flex-end;
      }
    `,
  ],
  template: `
    <div *ngIf="profileLoading">Loading</div>

    <watt-shell *ngIf="!profileLoading">
      <ng-container watt-shell-sidenav>
        <ett-primary-navigation></ett-primary-navigation>
      </ng-container>

      <ng-container watt-shell-toolbar>
        <div class="${selector}__toolbar">
          <h1>Energy Origin</h1>
          <div class="menu">
            <watt-button
              type="text"
              size="normal"
              [disabled]="false"
              [loading]="false"
              [matMenuTriggerFor]="menu"
            >
              {{ profile?.name }}
              <mat-icon aria-hidden="false" aria-label="Logout"
                >expand_more</mat-icon
              >
            </watt-button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="logout()">Logout</button>
            </mat-menu>
          </div>
        </div>
      </ng-container>

      <router-outlet></router-outlet>
    </watt-shell>
  `,
})
export class EttShellComponent implements OnInit {
  profile?: UserProfile;
  profileLoading = true;

  constructor(
    private router: Router,
    private change: ChangeDetectorRef,
    private authOidc: AuthOidcHttp
  ) {}

  ngOnInit() {
    this.getProfile();
  }

  // -- Logout ---------------------------------------------------------------

  logout() {
    this.authOidc
      .logout()
      .pipe(map((response) => response.success))
      .subscribe(this.onLogoutComplete.bind(this));
  }

  private onLogoutComplete(success: boolean) {
    if (success) {
      this.router.navigate(['/login']);
    }
  }

  // -- GetProfile -----------------------------------------------------------

  getProfile() {
    this.profileLoading = true;
    this.authOidc
      .getProfile()
      .subscribe(this.onGetProfileComplete.bind(this));
  }

  private onGetProfileComplete(response?: GetProfileResponse) {
    if (response?.success) {
      this.profile = response.profile;
      this.profileLoading = false;
      // TODO Replace with observables:
      this.change.markForCheck();
    }
  }
}

@NgModule({
  declarations: [EttShellComponent],
  imports: [
    CommonModule,
    RouterModule,
    WattShellModule,
    WattButtonModule,
    MatIconModule,
    MatMenuModule,
    EttPrimaryNavigationScam,
  ],
})
export class EttShellScam {}
