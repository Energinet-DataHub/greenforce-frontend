import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import { map, take, tap, timer } from 'rxjs';
import { TranslocoDirective } from '@ngneat/transloco';

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
  standalone: true,
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
