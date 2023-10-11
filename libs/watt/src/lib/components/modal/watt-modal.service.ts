import { ComponentType } from '@angular/cdk/portal';
import { DestroyRef, EventEmitter, Injectable, NgModule, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { Subject, exhaustMap, ignoreElements, map, mergeWith, of, take, tap } from 'rxjs';

export type WattModalSize = 'small' | 'normal' | 'large';

export interface WattModalConfig {
  size?: WattModalSize;
  templateRef?: TemplateRef<unknown>;
  component?: ComponentType<unknown>;
  disableClose?: boolean;
  onClosed?: EventEmitter<boolean> | ((result: boolean) => void);

}

const sizeConfig: Record<WattModalSize, MatDialogConfig> = {
  small: { width: '36vw', maxHeight: '100vh' },
  normal: { width: '50vw', maxHeight: '100vh' },
  large: { width: '65vw', maxHeight: '100vh' },
};

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
        if(!template) return of(false);

        const dialog = this.dialog.open(template, {
          autoFocus: 'dialog',
          panelClass: [
            'watt-modal-panel',
            ...(config.component ? ['watt-modal-panel--component'] : [])
          ],
          disableClose: config.disableClose ?? false,
          ...sizeConfig[config.size ?? 'normal'],
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

    result$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
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
