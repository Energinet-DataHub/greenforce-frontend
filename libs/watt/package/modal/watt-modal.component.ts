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
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  afterRenderEffect,
  booleanAttribute,
  inject,
  input,
  output,
  viewChild,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

import { WattResizeObserverDirective } from '@energinet/watt/utils/resize-observer';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { WattModalService } from './watt-modal.service';
import { WattIcon, WattIconComponent } from '@energinet/watt/icon';

export type WattModalSize = 'small' | 'medium' | 'large';

/**
 * Component for representing a binary decision in the form of
 * a modal window that appears in front of the entire content.
 *
 * Usage:
 * `import { WATT_MODAL } from '@energinet/watt/modal';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-modal',
  styleUrls: ['./watt-modal.component.scss'],
  templateUrl: './watt-modal.component.html',
  imports: [
    NgTemplateOutlet,
    WattResizeObserverDirective,
    WattButtonComponent,
    WattSpinnerComponent,
    WattIconComponent,
  ],
})
export class WattModalComponent {
  private modalService = inject(WattModalService);
  protected dialogRef = inject<MatDialogRef<unknown>>(MatDialogRef, { optional: true });

  /** Title to stay fixed to top of modal. */
  title = input('');

  size = input<WattModalSize>('medium');

  /** Whether the modal should show a loading state. */
  loading = input(false);

  /** Whether the modal should show a loading text for the loading state. */
  loadingMessage = input('');

  /** Disable ESC, close button and backdrop click as methods of closing. */
  disableClose = input(false);

  /** Whether to show the close button */
  hideCloseButton = input(false);

  /** Disable ESC, backdrop click as methods of closing. */
  disableEscAndBackdropClose = input(false);

  /** The aria-label for the close button. */
  closeLabel = input('Close');

  /** Classes added to the modal panel */
  panelClass = input<string[]>([]);

  minHeight = input('147px');

  /** Whether the dialog should restore focus to the previously-focused element, after it's closed. */
  restoreFocus = input(true);

  /** Icon displayed next to the modal title. */
  titleIcon = input<WattIcon | undefined>(undefined);

  /** Whether the modal should open automatically when rendered.  */
  autoOpen = input(false, { transform: booleanAttribute });

  closed = output<boolean>();

  modal = viewChild<TemplateRef<Element>>('modal');

  scrollable = signal(false);

  constructor() {
    afterRenderEffect(() => {
      if (this.autoOpen()) {
        this.open();
      }
    });
  }

  /**
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open() {
    this.modalService.open({
      disableClose: this.disableEscAndBackdropClose() || this.disableClose(),
      templateRef: this.modal(),
      onClosed: (result: boolean) => this.closed.emit(result),
      minHeight: this.minHeight(),
      panelClass: this.panelClass(),
      restoreFocus: this.restoreFocus(),
    });
  }

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this.modalService.close(result); // inline modal
    this.dialogRef?.close(result); // injected modal
  }

  /**
   * Called when the modal content element changes size.
   * @ignore
   */
  onResize(event: ResizeObserverEntry) {
    this.scrollable.set(event.target.scrollHeight > event.target.clientHeight);
  }
}

/**
 * Component for projecting buttons (actions) to the bottom of the modal.
 */
@Component({
  selector: 'watt-modal-actions',
  template: '<ng-content />',
})
export class WattModalActionsComponent {}

export const WATT_MODAL = [WattModalComponent, WattModalActionsComponent];
