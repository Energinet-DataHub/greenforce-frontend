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
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar';

import { WattToastComponent, WattToastConfig } from './watt-toast.component';

@Injectable({
  providedIn: 'root',
})
export class WattToastService {
  private ref?: MatSnackBarRef<WattToastComponent>;

  constructor(private _snackBar: MatSnackBar) {}

  open(config: WattToastConfig): MatSnackBarRef<WattToastComponent> {
    this.ref = this._snackBar.openFromComponent(WattToastComponent, {
      data: config,
    });
    return this.ref;
  }

  update(config: Partial<WattToastConfig>): void {
    if (!this.ref) return;
    this.ref.instance.update(config);
  }

  dismiss() {
    if (!this.ref) return;
    this.ref.dismiss();
  }
}
