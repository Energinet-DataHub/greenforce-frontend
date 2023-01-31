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
import { CommonModule } from '@angular/common';
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
  MatLegacySnackBarModule as MatSnackBarModule,
  MatLegacySnackBarRef as MatSnackBarRef,
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
} from '@angular/material/legacy-snack-bar';
import { fromEvent, repeat, Subscription, takeUntil, tap, timer } from 'rxjs';

import { WattIconModule } from '../../foundations/icon';
import { WattButtonModule } from '../button';
import { WattSpinnerModule } from '../spinner';

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
  actionLabel?: string;
}

export type WattToastRef = MatSnackBarRef<WattToastComponent>;

/**
 * Usage:
 * `import { WattToastService } from '@energinet-datahub/watt/toast';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-toast',
  styleUrls: ['./watt-toast.component.scss'],
  templateUrl: './watt-toast.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    WattButtonModule,
    WattIconModule,
    WattSpinnerModule,
  ],
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

  update(config: Partial<WattToastConfig>) {
    this.config = { ...this.config, ...config };
    if (this.dissmissToastSubscription) {
      this.dissmissToastSubscription.unsubscribe();
    }
    this.initDuration();
  }

  /**
   * @ignore
   * Ensure the toast won't get dismissed when the user hovers over it.
   */
  private initDuration(duration = 5000): void {
    // When the type is loading, the developer is responsible for dismissing the toast manually.
    if (this.config.type === 'loading') return;

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
