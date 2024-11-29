import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

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
