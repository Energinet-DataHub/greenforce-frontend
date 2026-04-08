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
import { ComponentType } from '@angular/cdk/portal';
import { EventEmitter, Injectable, Injector, TemplateRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, take } from 'rxjs';

export interface WattModalConfig<T> {
  templateRef?: TemplateRef<unknown>;
  component?: ComponentType<WattTypedModal<T>>;
  data?: T;
  disableClose?: boolean;
  onClosed?: EventEmitter<boolean> | ((result: boolean) => void);
  minHeight?: string;
  panelClass?: string[];
  injector?: Injector;
  restoreFocus?: boolean;
}

export abstract class WattTypedModal<T = void> {
  protected modalData: T = inject(MAT_DIALOG_DATA);
  protected dialogRef: MatDialogRef<WattTypedModal<T>> = inject(MatDialogRef);
}

@Injectable()
export class WattModalService {
  private readonly dialog = inject(MatDialog);
  private matDialogRef: MatDialogRef<unknown> | undefined;

  /**
   * Opens a modal with a callback-based `onClosed` handler (boolean result).
   */
  open<T>(config: WattModalConfig<T> & { onClosed: EventEmitter<boolean> | ((result: boolean) => void) }): void;

  /**
   * Opens a modal and returns an observable with the typed result from `dialogRef.close(result)`.
   * Emits `undefined` if the modal is dismissed without a result.
   */
  open<TResult, TData = void>(config: Omit<WattModalConfig<TData>, 'onClosed'>): Observable<TResult | undefined>;

  /**
   * @deprecated Use the overload with `onClosed` callback or the observable-returning overload.
   */
  open<T>(config: WattModalConfig<T>): Observable<unknown> | void;

  open<T>(config: WattModalConfig<T>): Observable<unknown> | void {
    const template = config.templateRef ?? config.component;

    if (!template) return;

    this.matDialogRef = this.openModal(template, config);

    if (config.minHeight) this.setMinHeight(config.minHeight);

    if (config.onClosed) {
      this.matDialogRef
        .afterClosed()
        .pipe(map(Boolean), take(1))
        .subscribe((result) => {
          if (config.onClosed instanceof EventEmitter) {
            config.onClosed.emit(result);
          } else {
            config.onClosed?.(result);
          }
        });
      return;
    }

    return this.matDialogRef.afterClosed().pipe(take(1));
  }

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this.matDialogRef?.close(result);
  }

  private openModal<T>(
    template: TemplateRef<unknown> | ComponentType<WattTypedModal<T>>,
    config: WattModalConfig<T>
  ): MatDialogRef<unknown> {
    return this.dialog.open(template, {
      autoFocus: 'dialog',
      panelClass: [
        'watt-modal-panel',
        ...(config.component ? ['watt-modal-panel--component'] : []),
        ...(config.panelClass ?? []),
      ],
      disableClose: config.disableClose ?? false,
      data: config.data,
      maxWidth: 'none',
      injector: config.injector,
      restoreFocus: config.restoreFocus !== false,
    });
  }

  private setMinHeight(minHeight: string) {
    setTimeout(() => {
      document
        ?.getElementById(this.matDialogRef?.id ?? '')
        ?.querySelector('.watt-modal')
        ?.setAttribute('style', `--watt-modal-min-height: ${minHeight}`);
    });
  }
}
