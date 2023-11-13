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
import { DestroyRef, EventEmitter, Injectable, NgModule, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, exhaustMap, ignoreElements, map, mergeWith, of, take, tap } from 'rxjs';

export interface WattModalConfig {
  templateRef?: TemplateRef<unknown>;
  component?: ComponentType<unknown>;
  data?: unknown;
  disableClose?: boolean;
  onClosed?: EventEmitter<boolean> | ((result: boolean) => void);
}

@Injectable()
export class WattModalService {
  private config?: WattModalConfig;
  private openSubject = new Subject<WattModalConfig>();
  private closeSubject = new Subject<boolean>();

  constructor(private dialog: MatDialog, private destroyRef: DestroyRef) {
    const result$ = this.openSubject.pipe(
      exhaustMap((config) => {
        this.config = config;

        const template = config.templateRef ?? config.component;
        if (!template) return of(false);

        const dialog = this.dialog.open(template, {
          autoFocus: 'dialog',
          panelClass: [
            'watt-modal-panel',
            ...(config.component ? ['watt-modal-panel--component'] : []),
          ],
          disableClose: config.disableClose ?? false,
          data: config.data,
          maxWidth: 'none',
        });

        return this.closeSubject.pipe(
          tap((result) => dialog.close(result)),
          ignoreElements(),
          mergeWith(dialog.afterClosed()),
          map(Boolean), // backdrop click emits `undefined`
          take(1)
        );
      })
    );

    result$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      this.config?.onClosed instanceof EventEmitter
        ? this.config?.onClosed.emit(result)
        : this.config?.onClosed?.(result);
    });
  }

  /**
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open(config: WattModalConfig) {
    this.openSubject.next(config);
  }

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this.closeSubject.next(result);
  }
}

@NgModule({
  imports: [MatDialogModule],
  providers: [WattModalService],
})
export class WattModalModule {}
