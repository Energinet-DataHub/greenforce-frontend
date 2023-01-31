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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogConfig as MatDialogConfig,
} from '@angular/material/legacy-dialog';
import {
  exhaustMap,
  ignoreElements,
  map,
  mergeWith,
  Subject,
  take,
  tap,
} from 'rxjs';

export type WattModalSize = 'small' | 'normal' | 'large';

const sizeConfig: Record<WattModalSize, MatDialogConfig> = {
  small: { width: '36vw', maxHeight: '45vh' },
  normal: { width: '50vw', maxHeight: '65vh' },
  large: { width: '65vw', maxHeight: '90vh' },
};

/**
 * Component for representing a binary decision in the form of
 * a modal window that appears in front of the entire content.
 *
 * Usage:
 * `import { WattModalModule } from '@energinet-datahub/watt/modal';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-modal',
  styleUrls: ['./watt-modal.component.scss'],
  templateUrl: './watt-modal.component.html',
})
export class WattModalComponent implements AfterViewInit {
  /** Title to stay fixed to top of modal. */
  @Input()
  title = '';

  /** Used to adjust modal size to best fit the content. */
  @Input()
  size: WattModalSize = 'normal';

  /** Disable ESC, close button and backdrop click as methods of closing. */
  @Input()
  disableClose = false;

  /** The aria-label for the close button. */
  @Input()
  closeLabel = 'Close';

  /**
   * When modal is closed, emits `true` if it was "accepted",
   * otherwise emits `false`.
   * @ignore
   */
  @Output()
  closed = new EventEmitter<boolean>();

  /** @ignore */
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  /** @ignore */
  scrollable = false;

  /** @ignore */
  private openSubject = new Subject<void>();

  /** @ignore */
  private closeSubject = new Subject<boolean>();

  /** @ignore */
  private get options(): MatDialogConfig {
    return {
      autoFocus: 'dialog',
      panelClass: 'watt-modal-panel',
      disableClose: this.disableClose,
      ...sizeConfig[this.size],
    };
  }

  constructor(private dialog: MatDialog) {}

  /** @ignore */
  ngAfterViewInit() {
    const result$ = this.openSubject.pipe(
      exhaustMap(() => {
        const dialog = this.dialog.open(this.modal, this.options);
        return this.closeSubject.pipe(
          tap((result) => dialog.close(result)),
          ignoreElements(),
          mergeWith(dialog.afterClosed()),
          map(Boolean), // backdrop click emits `undefined`
          take(1)
        );
      })
    );

    // Subjects are garbage collected and `afterClosed()` automatically
    // completes when component is destroyed, so no need for unsubscribe.
    result$.subscribe((result) => this.closed.emit(result));
  }

  /**
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open() {
    this.openSubject.next();
  }

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this.closeSubject.next(result);
  }

  /**
   * Called when the modal content element changes size.
   * @ignore
   */
  onResize(event: ResizeObserverEntry) {
    this.scrollable = event.target.scrollHeight > event.target.clientHeight;
  }
}

/**
 * Component for projecting buttons (actions) to the bottom of the modal.
 */
@Component({
  selector: 'watt-modal-actions',
  template: '<ng-content></ng-content>',
})
export class WattModalActionsComponent {}
