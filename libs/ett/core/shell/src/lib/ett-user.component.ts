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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import {
  AuthOidcHttp,
  GetProfileResponse,
  UserProfile,
} from '@energinet-datahub/ett/auth/data-access-api';
import { WattButtonModule } from '@energinet-datahub/watt';
import { map } from 'rxjs';

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
    <!-- <ng-container *ngIf="!profileLoading; else loading"> -->
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
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu>
    <!-- </ng-container> -->

    <!-- <ng-template #loading>Loading profile...</ng-template> -->
  `,
})
export class EttUserComponent implements OnInit {
  profile?: UserProfile | null;
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
    this.authOidc.getProfile().subscribe(this.onGetProfileComplete.bind(this));
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
  declarations: [EttUserComponent],
  exports: [EttUserComponent],
  imports: [MatIconModule, MatMenuModule, WattButtonModule],
})
export class EttUserScam {}
