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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import {
  fromEvent,
  Observable,
  repeat,
  repeatWhen,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

export type WattToastType =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'loading';

export interface WattToastConfig {
  duration?: number;
  type?: WattToastType;
  message: string;
  action?: (wattToastRef: WattToastRef) => void;
}

export type WattToastRef = MatSnackBarRef<WattToastComponent>;

/**
 * Usage:
 * `import { WattToastModule } from '@energinet-datahub/watt';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-toast',
  styleUrls: ['./watt-toast.component.scss'],
  templateUrl: './watt-toast.component.html',
})
export class WattToastComponent {
  @HostBinding('class') get class() {
    this.cd.detectChanges(); // Make sure changes to the config will be detected
    return this.config.type
      ? `watt-toast watt-toast--${this.config.type}`
      : 'watt-toast';
  }

  /**
   * @ignore
   */
  config: WattToastConfig;

  /**
   * @ignore
   */
  matSnackBarRef: WattToastRef;

  /**
   * @ignore
   */
  private dissmissToastSubscription?: Subscription;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private _config: WattToastConfig,
    private cd: ChangeDetectorRef,
    @Optional() private _matSnackBarRef: MatSnackBarRef<WattToastComponent>,
    private elementRef: ElementRef
  ) {
    this.config = this._config;
    this.matSnackBarRef = this._matSnackBarRef;
    this.initDuration(this.config.duration);
  }

  /**
   * @ignore
   */
  onClose(): void {
    if (!this.matSnackBarRef) return;
    this.matSnackBarRef.dismiss();
    this.dissmissToastSubscription?.unsubscribe();
  }

  /**
   * @ignore
   * Ensure the toast won't get dismissed when the user hovers over it.
   */
  private initDuration(duration = 5000): void {
    // When the type is loading, the developer is responsible for dismissing the toast manually.
    if(this.config.type === 'loading') return;

    const mouseEnter$ = fromEvent(this.elementRef.nativeElement, 'mouseenter');
    const mouseLeave$ = fromEvent(this.elementRef.nativeElement, 'mouseleave');

    this.dissmissToastSubscription = timer(duration)
      .pipe(
        tap(() => this.onClose()),
        takeUntil(mouseEnter$),
        repeat({ delay: () => mouseLeave$ })
      )
      .subscribe();
  }
}
