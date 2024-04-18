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
import { EventEmitter, Injectable, Injector, NgModule, TemplateRef, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { map, take } from 'rxjs';

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
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open = <T>(config: WattModalConfig<T>) => {
    const template = config.templateRef ?? config.component;

    if (!template) return;

    this.matDialogRef = this.openModal(template, config);

    this.matDialogRef
      .afterClosed()
      .pipe(map(Boolean), take(1))
      .subscribe((result) => {
        config?.onClosed instanceof EventEmitter
          ? config?.onClosed.emit(result)
          : config?.onClosed?.(result);
      });

    if (config.minHeight) this.setMinHeight(config.minHeight);
  };

  /**
   * Opens the modal using the provided template and configuration.
   */
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
      restoreFocus: config.restoreFocus === false ? false : true,
    });
  }

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this.matDialogRef?.close(result);
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

@NgModule({
  imports: [MatDialogModule],
  providers: [WattModalService],
})
export class WattModalModule {}
