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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  exhaustMap,
  of,
  Subject,
  switchMap,
  take,
  mergeWith,
  ignoreElements,
  tap,
} from 'rxjs';

export type WattModalSize = 'small' | 'normal' | 'large';
export type WattModalResult = 'accept' | 'reject' | 'dismiss';

function getDialogConfigFromSize(size: WattModalSize): MatDialogConfig {
  switch (size) {
    case 'small':
      return { width: '36vw', maxHeight: '45vh' };
    case 'normal':
      return { width: '50vw', maxHeight: '65vh' };
    case 'large':
      return { width: '65vw', maxHeight: '90vh' };
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-modal',
  styleUrls: ['./watt-modal.component.scss'],
  templateUrl: './watt-modal.component.html',
})
export class WattModalComponent implements AfterViewInit {
  @Input()
  size: WattModalSize = 'normal';

  @Input()
  disableClose = false;

  /**
   * Emits when the modal is closed.
   * @ignore
   */
  @Output()
  closed = new EventEmitter<WattModalResult>();

  /** @ignore */
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  private get options(): MatDialogConfig {
    return {
      disableClose: this.disableClose,
      hasBackdrop: false,
      ...getDialogConfigFromSize(this.size),
    };
  }

  private openSubject = new Subject<void>();
  private closeSubject = new Subject<WattModalResult>();

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    const result$ = this.openSubject.pipe(
      exhaustMap(() => {
        const dialog = this.dialog.open(this.modal, this.options);
        return this.closeSubject.pipe(
          tap((result) => dialog.close(result)),
          ignoreElements(),
          mergeWith(dialog.afterClosed()),
          take(1)
        );
      })
    );

    // Subjects and afterClosed will be garbage collected
    result$.subscribe((result) => this.closed.emit(result));
  }

  /**
   * @ignore
   */
  open() {
    this.openSubject.next();
  }

  close(result: WattModalResult) {
    this.closeSubject.next(result);
  }
}
