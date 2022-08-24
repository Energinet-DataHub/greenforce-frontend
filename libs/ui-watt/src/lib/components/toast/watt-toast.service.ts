import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";

import { WattToastComponent } from "./watt-toast.component";
import { WattToastConfig } from "./watt-toast.component";

@Injectable({
  providedIn: 'root'
})
export class WattToastService {
  constructor(private _snackBar: MatSnackBar) {}

  open(config: WattToastConfig): MatSnackBarRef<WattToastComponent> {
    return this._snackBar.openFromComponent(WattToastComponent, {
      duration: config.duration || 5000,
      data: config,
    });
  }
}
