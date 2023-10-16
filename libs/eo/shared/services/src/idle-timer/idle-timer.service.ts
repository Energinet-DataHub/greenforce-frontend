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
/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  Subject,
  debounceTime,
  fromEvent,
  map,
  merge,
  startWith,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import { WattModalService } from '@energinet-datahub/watt/modal';

import { EoAuthService } from '../auth/auth.service';

import {
  EoIdleTimerCountdownModalComponent,
  EoIdleTimerLoggedOutModalComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Injectable({
  providedIn: 'root',
})
export class IdleTimerService {
  private dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent> | undefined;
  private warningTimeout = 900000; // 15 minutes in milliseconds
  private logoutTimeout = 300000; // 5 minutes in milliseconds
  private activityEvents = [
    'mousemove',
    'mousedown',
    'keydown',
    'wheel',
    'touchstart',
    'touchmove',
  ];
  private destroy$ = new Subject<void>();
  private lastActivity!: number | null;

  constructor(private authService: EoAuthService, private modalService: WattModalService) {}

  startMonitor() {
    // Reset earlier subscriptions
    this.destroy$.next();

    // Create a stream of events which are considered as user activity
    const activity$ = merge(...this.activityEvents.map((event) => fromEvent(document, event)));

    // Start the logic for watching inactivity
    activity$
      .pipe(
        startWith('inactive'),
        debounceTime(this.warningTimeout), // wait for inactivity
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.showLogoutWarning();
      });

    // Check if the tab has timed out after user has been on other tabs
    fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntil(this.destroy$),
        map(() => document.visibilityState === 'visible')
      )
      .subscribe((tabIsActive: boolean) => {
        if (!tabIsActive && !this.dialogRef) {
          this.lastActivity = new Date().getTime();
        } else {
          if (!this.lastActivity) this.lastActivity = new Date().getTime();
          const shouldHaveBeenWarned =
            new Date().getTime() - this.lastActivity >= this.warningTimeout;
          if (shouldHaveBeenWarned) this.showLogoutWarning(this.lastActivity);
        }
      });
  }

  stopMonitor() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showLogoutWarning(lastActivity?: number) {
    if (this.dialogRef) {
      return;
    }

    if (!lastActivity) lastActivity = new Date().getTime();

    const countdown$ = timer(0, 1000).pipe(
      takeUntil(this.destroy$),
      map(() => (lastActivity as number) + this.logoutTimeout - new Date().getTime()),
      map((remainingTime) => {
        const minutes = Math.max(0, Math.floor(remainingTime / 60000));
        const seconds = Math.max(0, Math.floor((remainingTime % 60000) / 1000));

        return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
      })
    );

    this.modalService.open({
      component: EoIdleTimerCountdownModalComponent,
      data: {
        countdown$,
      },
      onClosed: (logout: boolean) => {
        this.dialogRef = undefined;
        this.lastActivity = null;

        if (logout) {
          this.authService.logout();
          this.stopMonitor();

          setTimeout(() => {
            this.showLogoutConfirmation();
          });
        }
      },
    });
  }

  private showLogoutConfirmation() {
    this.modalService.open({
      component: EoIdleTimerLoggedOutModalComponent,
    });
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
