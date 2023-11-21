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
import { WattModalService } from '@energinet-datahub/watt/modal';
import { DhInactivityLogoutComponent } from './dh-inactivity-logout.component';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn: 'root' })
export class DhInactivityDetectionService {
  private readonly secondsUntilWarning = 115 * 60;

  private readonly inputDetection$ = merge(
    fromEvent(document, 'mousemove'),
    fromEvent(document, 'mousedown'),
    fromEvent(document, 'keydown'),
    fromEvent(document, 'wheel'),
    fromEvent(document, 'touchmove'),
    fromEvent(document, 'touchstart')
  );

  private readonly userInactive$ = this.inputDetection$.pipe(
    startWith(null),
    switchMap(() => concat(of(1), timer(this.secondsUntilWarning * 1000))),
    distinctUntilChanged(),
    map((isActive) => !isActive)
  );

  constructor(
    private readonly modalService: WattModalService,
    private readonly msal: MsalService
  ) {}

  public trackInactivity() {
    this.userInactive$.subscribe((isInactive) => {
      if (isInactive) {
        this.modalService.open({
          component: DhInactivityLogoutComponent,
          onClosed: (result) => result && this.msal.logoutRedirect(),
        });
      } else {
        this.modalService.close(false);
      }
    });
  }
}
