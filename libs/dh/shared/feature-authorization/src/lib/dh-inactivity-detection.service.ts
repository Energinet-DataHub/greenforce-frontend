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
