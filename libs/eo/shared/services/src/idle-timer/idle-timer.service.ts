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
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  fromEvent,
  merge,
  startWith,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { EoIdleTimerCountdownModalComponent } from './idle-timer-countdown.component';
import { EoIdleTimerLoggedOutModalComponent } from './idle-timer-logged-out.component';

@Injectable({
  providedIn: 'root',
})
export class IdleTimerService {
  allowedInactiveTime = 5000; // milliseconds
  dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent> | undefined;
  subscription$: Subscription | undefined;
  monitoredEvents$ = merge(
    fromEvent(document, 'visibilitychange'),
    fromEvent(document, 'click'),
    fromEvent(document, 'keyup')
  );

  constructor(private dialog: MatDialog) {}

  attachMonitorsWithTimer() {
    return this.monitoredEvents$.pipe(
      startWith(0), // Starts timer, no matter if user already interacted or not
      switchMap(() => timer(this.allowedInactiveTime))
    );
  }

  startIdleMonitor() {
    this.subscription$ = this.attachMonitorsWithTimer().subscribe(() =>
      this.showLogoutWarning()
    );
  }

  stopIdleMonitor() {
    this.subscription$?.unsubscribe();
  }

  private showLogoutWarning() {
    this.stopIdleMonitor();

    this.dialog
      .open(EoIdleTimerCountdownModalComponent)
      .afterClosed()
      .subscribe((result: string) => {
        if (result === 'logout') {
          this.dialog.open(EoIdleTimerLoggedOutModalComponent);
          return;
        }
        this.startIdleMonitor();
      });
  }
}
