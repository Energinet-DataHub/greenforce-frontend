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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

import { WattResizeObserverDirective } from '@energinet-datahub/watt/utils/resize-observer';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { WattModalModule, WattModalService } from './watt-modal.service';

export type WattModalSize = 'small' | 'medium' | 'large';

/**
 * Component for representing a binary decision in the form of
 * a modal window that appears in front of the entire content.
 *
 * Usage:
 * `import { WATT_MODAL } from '@energinet-datahub/watt/modal';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-modal',
  styleUrls: ['./watt-modal.component.scss'],
  templateUrl: './watt-modal.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,

    WattResizeObserverDirective,
    WattButtonComponent,
    WattSpinnerComponent,
    WattModalModule,
  ],
})
export class WattModalComponent {
  private modalService = inject(WattModalService);
  protected dialogRef = inject<MatDialogRef<unknown>>(MatDialogRef, { optional: true });
  /** Title to stay fixed to top of modal. */
  @Input() title = '';

  @Input() size: WattModalSize = 'medium';

  /** Whether the modal should show a loading state. */
  @Input() loading = false;

  /** Whether the modal should show a loading text for the loading state. */
  @Input() loadingMessage = '';

  /** Disable ESC, close button and backdrop click as methods of closing. */
  @Input() disableClose = false;

  /** Whether to show the close button */
  @Input() hideCloseButton = false;

  /** Disable ESC, backdrop click as methods of closing. */
  @Input() disableEscAndBackdropClose = false;

  /** The aria-label for the close button. */
  @Input() closeLabel = 'Close';

  /** Classes added to the modal panel */
  @Input() panelClass: string[] = [];

  @Input() minHeight = '147px';

  /** Whether the dialog should restore focus to the previously-focused element, after it's closed. */
  @Input() restoreFocus = true;

  /**
   * When modal is closed, emits `true` if it was "accepted",
   * otherwise emits `false`.
   * @ignore
   */
  @Output() closed = new EventEmitter<boolean>();

  /** @ignore */
  @ViewChild('modal') modal!: TemplateRef<Element>;

  /** @ignore */
  scrollable = false;

  /**
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open() {
    this.modalService.open({
      disableClose: this.disableEscAndBackdropClose || this.disableClose,
      templateRef: this.modal,
      onClosed: this.closed,
      minHeight: this.minHeight,
      panelClass: this.panelClass,
      restoreFocus: this.restoreFocus,
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
    this.scrollable = event.target.scrollHeight > event.target.clientHeight;
  }
}

/**
 * Component for projecting buttons (actions) to the bottom of the modal.
 */
@Component({
  selector: 'watt-modal-actions',
  template: '<ng-content />',
  standalone: true,
})
export class WattModalActionsComponent {}

export const WATT_MODAL = [WattModalComponent, WattModalActionsComponent];
