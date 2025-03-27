//#region License
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
//#endregion
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import { map, take, tap, timer } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';

@Component({
  selector: 'dh-inactivity-logout',
  styles: [
    `
      h2 {
        text-align: center;
      }
    `,
  ],
  template: `
    <watt-modal *transloco="let t" [size]="'small'" [title]="t('sessionExpirationTitle')">
      <p>{{ t('sessionExpirationContentPartA') }}<br />{{ t('sessionExpirationContentPartB') }}</p>
      <h2>{{ warningCountdown$ | push | date: 'mm:ss' }}</h2>
    </watt-modal>
  `,
  imports: [RxPush, DatePipe, TranslocoDirective, WATT_MODAL],
})
export class DhInactivityLogoutComponent extends WattTypedModal {
  private readonly secondsUntilLogOff = 10;

  readonly warningCountdown$ = timer(0, 1000).pipe(
    take(this.secondsUntilLogOff + 1),
    tap((elapsed) => elapsed >= this.secondsUntilLogOff && this.dialogRef.close(true)),
    map((elapsed) => Math.max(0, this.secondsUntilLogOff - elapsed - 1)),
    map((elapsed) => new Date(elapsed * 1000))
  );
}
