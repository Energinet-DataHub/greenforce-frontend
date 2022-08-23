import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";

import { WattToastComponent } from "./watt-toast.component";
import { WattToastConfig } from "./watt-toast.component";

@Injectable({
  providedIn: 'root'
})
export class WattToastService {
  constructor(private _snackBar: MatSnackBar) {}

  open(duration: number = 5000): MatSnackBarRef<WattToastComponent> {
    const config: WattToastConfig = {
      type: 'success',
      message: 'You successfully launched a toast!'
    };
    return this._snackBar.openFromComponent(WattToastComponent, {
      duration,
      data: config,
    });
  }
}
