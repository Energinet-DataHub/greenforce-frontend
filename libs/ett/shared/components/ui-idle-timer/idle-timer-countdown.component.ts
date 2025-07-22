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
import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { Observable, filter, tap } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, WATT_MODAL, AsyncPipe, DatePipe],
  template: `
    <watt-modal #modal title="Automatic logout" size="small">
      <p>You will be logged out in:</p>
      <span class="watt-headline-1">{{ countdown$ | async | date: 'mm:ss' }}</span>
      <br />
      <p>We are logging you out for security reasons.</p>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(true)">Log out</watt-button>
        <watt-button (click)="modal.close(false)">Stay logged in</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EttIdleTimerCountdownModalComponent extends WattTypedModal<{
  countdown$: Observable<number>;
}> {
  protected countdown$!: Observable<number>;

  constructor() {
    super();
    this.countdown$ = this.modalData.countdown$.pipe(
      takeUntilDestroyed(),
      tap((x: number) => {
        if (x <= 0) {
          this.dialogRef.close(true);
        }
      }),
      filter((x: number) => x >= 0)
    );
  }
}
