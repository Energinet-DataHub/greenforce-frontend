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
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import {
  concat,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  of,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { TranslocoModule } from '@ngneat/transloco';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'dh-inactivity-logout',
  styles: [
    `
      h2 {
        text-align: center;
      }
    `,
  ],
  templateUrl: './dh-inactivity-logout.component.html',
  standalone: true,
  imports: [CommonModule, RxPush, TranslocoModule, WATT_MODAL],
})
export class DhInactivityLogoutComponent {
  private readonly secondsUntilWarning = 10;
  private readonly secondsUntilLogOff = 10;
  private isInactive = false;

  constructor(private readonly msal: MsalService) {}

  @ViewChild('inactivityWarningModal')
  inactivityWarningModal!: WattModalComponent;

  private readonly inputDetection$ = merge(
    of(1),
    fromEvent(document, 'mousemove'),
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'wheel'),
    fromEvent(document, 'touchmove'),
    fromEvent(document, 'touchstart'),
  );

  readonly userActive$ = this.inputDetection$.pipe(
    switchMap(() => concat(of(1), timer(this.secondsUntilWarning * 1000))),
    map((isActive) => !!isActive),
    tap((isActive) => (this.isInactive = !isActive))
  );

  readonly warningTimeout$ = this.userActive$.pipe(
    tap((isActive) => {
      return isActive
        ? this.inactivityWarningModal?.close(false)
        : this.inactivityWarningModal?.open();
    }),
    switchMap((isActive) => {
      if (isActive) return of(this.secondsToTime(this.secondsUntilLogOff));

      return interval(1000).pipe(
        take(this.secondsUntilLogOff + 1),
        filter(() => this.isInactive),
        map((elapsed) => this.secondsUntilLogOff - elapsed - 1),
        tap((remaining) => remaining === -1 && this.msal.logout()),
        map((remaining) => (remaining >= 0 ? this.secondsToTime(remaining) : '00:00'))
      );
    })
  );

  private secondsToTime(seconds: number): string {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
}
