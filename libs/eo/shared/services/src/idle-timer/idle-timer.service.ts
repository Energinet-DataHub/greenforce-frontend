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
import { EoIdleTimerModalComponent } from './idle-timer-countdown.component';

@Injectable({
  providedIn: 'root',
})
export class IdleTimerService {
  timer: NodeJS.Timeout | undefined;
  dialogRef: MatDialogRef<EoIdleTimerModalComponent> | undefined;

  constructor(private dialog: MatDialog) {}

  stopIdleMonitor() {
    this.removeMonitors();
  }

  startIdleMonitor() {
    this.addMonitors();
  }

  addMonitors() {
    document.addEventListener('visibilitychange', this.resetTimer);
    document.addEventListener('mousedown', this.resetTimer);
    document.addEventListener('keydown', this.resetTimer);
    this.resetTimer();
  }

  removeMonitors() {
    document.removeEventListener('visibilitychange', this.resetTimer);
    document.removeEventListener('mousedown', this.resetTimer);
    document.removeEventListener('keydown', this.resetTimer);
    clearTimeout(this.timer);
  }

  resetTimer() {
    const showLogoutWarning = () => {
      console.log('going to show logout warning');
      console.log('dialog', this.dialogRef);
      this.dialogRef = this.dialog?.open(EoIdleTimerModalComponent);

      this.dialogRef?.afterClosed().subscribe((result) => {
        console.log('result', result);
        if (result === 'logout') {
          console.log('going to logout');
          return;
        }
        this.resetTimer();
      });
      console.log('dialog2', this.dialogRef);
    };

    console.log('reset timer');
    // const allowedInactiveTime = 900000; // 15 minutes
    const allowedInactiveTime = 3000;
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      showLogoutWarning();
    }, allowedInactiveTime);
  }
}
