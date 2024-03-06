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
import { ComponentType } from '@angular/cdk/portal';
import { Directive, EventEmitter, Injectable, Injector, TemplateRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface WattModalConfig<DialogData> {
  templateRef?: TemplateRef<unknown>;
  component?: ComponentType<StronglyTypedDialog<DialogData>>;
  data?: DialogData;
  disableClose?: boolean;
  onClosed?: EventEmitter<boolean> | ((result: boolean) => void);
  minHeight?: string;
  injector?: Injector;
}

@Directive()
export abstract class StronglyTypedDialog<DialogData = void> {
  protected data: DialogData = inject(MAT_DIALOG_DATA);
  protected dialogRef: MatDialogRef<StronglyTypedDialog<DialogData>> = inject(MatDialogRef);
}

@Injectable({ providedIn: 'root' })
export class WattModalService {
  private readonly dialog = inject(MatDialog);
  private _dialogInstance: MatDialogRef<unknown, unknown> | null = null;

  /**
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open = <DialogData>(config: WattModalConfig<DialogData>) => {
    const { templateRef, component, disableClose, data, injector, onClosed, minHeight } = config;
    const template = templateRef ?? component;

    if (!template) throw new Error('Either templateRef or component must be provided');

    this._dialogInstance = this.dialog.open(template, {
      autoFocus: 'dialog',
      panelClass: ['watt-modal-panel', ...(component ? ['watt-modal-panel--component'] : [])],
      disableClose,
      data,
      maxWidth: 'none',
      injector,
    });

    this._dialogInstance.afterClosed().subscribe((result) => {
      if (onClosed instanceof EventEmitter) {
        onClosed.emit(Boolean(result));
      } else if (typeof onClosed === 'function') {
        onClosed(Boolean(result));
      }
    });

    if (minHeight) this.setMinHeight(minHeight);
  };

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this._dialogInstance?.close(result);
  }

  private setMinHeight(minHeight: string) {
    setTimeout(() => {
      document
        ?.getElementById(this._dialogInstance?.id ?? '')
        ?.querySelector('.watt-modal')
        ?.setAttribute('style', `--watt-modal-min-height: ${minHeight}`);
    });
  }
}
