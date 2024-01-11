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
import { Injectable, NgZone, inject } from '@angular/core';
import {
  concat,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  of,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import { MsalService } from '@azure/msal-angular';

import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhInactivityLogoutComponent } from './dh-inactivity-logout.component';

enum ActivityState {
  Inactive,
  Active,
  Overdue,
}

@Injectable({ providedIn: 'root' })
export class DhInactivityDetectionService {
  private readonly ngZone = inject(NgZone);
  private readonly modalService = inject(WattModalService);
  private readonly msal = inject(MsalService);

  private readonly secondsUntilWarning = 115 * 60;
  private readonly secondsUntilOverdue = 5 * 60;

  private readonly inputDetection$ = merge(
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'wheel'),
    fromEvent(document, 'touchmove'),
    fromEvent(document, 'touchstart')
  );

  private readonly userInactive$ = this.inputDetection$.pipe(
    startWith(null),
    switchMap(() => {
      const suspendedAt = new Date();
      return concat(
        of(ActivityState.Active),
        timer(this.secondsUntilWarning * 1000).pipe(
          map(() => (this.isOverdue(suspendedAt) ? ActivityState.Overdue : ActivityState.Inactive))
        )
      );
    }),
    distinctUntilChanged()
  );

  public trackInactivity() {
    this.ngZone.runOutsideAngular(() => {
      this.userInactive$.subscribe((activityState) => {
        switch (activityState) {
          case ActivityState.Active:
            this.modalService.close(false);
            break;
          case ActivityState.Inactive:
            this.openModal();
            break;
          case ActivityState.Overdue:
            this.msal.logoutRedirect();
            break;
        }
      });
    });
  }

  private openModal() {
    this.ngZone.run(() => {
      this.modalService.open({
        component: DhInactivityLogoutComponent,
        onClosed: (result) => result && this.msal.logoutRedirect(),
      });
    });
  }

  private isOverdue(suspendedAt: Date) {
    return new Date().getTime() - suspendedAt.getTime() > 2 * 60 * 60 * 1000;
  }
}
