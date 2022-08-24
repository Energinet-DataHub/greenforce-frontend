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
  HostBinding,
  Inject,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

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

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private _config: WattToastConfig,
    private cd: ChangeDetectorRef,
    @Optional() private _matSnackBarRef: MatSnackBarRef<WattToastComponent>
  ) {
    this.config = this._config;
    this.matSnackBarRef = this._matSnackBarRef;
  }

  /**
   * @ignore
   */
  onClose() {
    if (!this.matSnackBarRef) return;
    this.matSnackBarRef.dismiss();
  }
}
