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
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import {
  EoIdleTimerCountdownModalComponent,
  EoIdleTimerLoggedOutModalComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoLandingPageRelativeUrl } from '@energinet-datahub/eo/shared/utilities';
import { fromEvent, merge, startWith, Subscription, switchMap, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IdleTimerService {
  allowedInactiveTime = 900000; // 15 minutes in milliseconds
  dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent> | undefined;
  subscription$: Subscription | undefined;
  monitoredEvents$ = merge(
    fromEvent(document, 'visibilitychange'),
    fromEvent(document, 'click'),
    fromEvent(document, 'keyup')
  );

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  attachMonitorsWithTimer() {
    return this.monitoredEvents$.pipe(
      startWith(0), // Starts timer, no matter if user already interacted or not
      switchMap(() => timer(this.allowedInactiveTime))
    );
  }

  startIdleMonitor() {
    this.subscription$ = this.attachMonitorsWithTimer().subscribe(() => this.showLogoutWarning());
  }

  stopIdleMonitor() {
    this.subscription$?.unsubscribe();
  }

  private showLogoutWarning() {
    this.stopIdleMonitor();

    this.dialog
      .open(EoIdleTimerCountdownModalComponent, {
        height: '500px',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result: string) => {
        if (result === 'logout') {
          this.authService.logout().subscribe((response) => {
            if (response.success) {
              this.router.navigateByUrl(eoLandingPageRelativeUrl);
              this.dialog.open(EoIdleTimerLoggedOutModalComponent, {
                height: '500px',
                autoFocus: false,
              });
            }
          });
          return;
        }

        this.startIdleMonitor();
      });
  }
}
