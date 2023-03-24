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
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  EoIdleTimerCountdownModalComponent,
  EoIdleTimerLoggedOutModalComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { Subscription, switchMap, tap, timer } from 'rxjs';
import { EoAuthService } from '../auth/auth.service';
import { EoAuthStore } from '../auth/auth.store';
import { IdleTimerService } from '../idle-timer/idle-timer.service';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService {
  subscription$: Subscription | undefined;

  constructor(
    private store: EoAuthStore,
    private dialog: MatDialog,
    private authService: EoAuthService,
    private idleService: IdleTimerService
  ) {}

  startMonitor() {
    this.subscription$ = timer(0, 1000)
      .pipe(
        switchMap(() => this.store.getTokenExpiry$),
        tap((val) => {
          // If logintoken exp is less than 5 minutes away from now
          if (val && val - new Date().getTime() / 1000 <= 300) {
            this.showLogoutWarning();
          }
        })
      )
      .subscribe();
  }

  stopMonitor() {
    this.subscription$?.unsubscribe();
  }

  private showLogoutWarning() {
    this.stopMonitor();
    this.idleService.stopMonitor();

    this.dialog
      .open(EoIdleTimerCountdownModalComponent, {
        height: '500px',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result: string) => {
        if (result === 'logout') {
          this.authService.logout();
          this.dialog.open(EoIdleTimerLoggedOutModalComponent, {
            height: '500px',
            autoFocus: false,
          });
          return;
        }

        this.startMonitor();
        this.idleService.startMonitor();
      });
  }
}
