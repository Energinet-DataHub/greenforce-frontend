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
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  filter,
  first,
  map,
  mergeWith,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

export type WattModalSize = 'small' | 'normal' | 'large';

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
export class WattModalComponent implements AfterViewInit, OnChanges, OnDestroy {
  private visibilitySubject = new Subject<boolean>();

  // Safely assigned in `ngAfterViewInit`
  private subscription!: Subscription;

  @Input()
  isOpen = false;

  @Output()
  isOpenChange = new EventEmitter<boolean>();

  @Input()
  size: WattModalSize = 'normal';

  @Input()
  disableClose = true;

  /** @ignore */
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  get options(): MatDialogConfig {
    return {
      disableClose: this.disableClose,
      ...getDialogConfigFromSize(this.size),
    };
  }

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    const dialog$ = this.visibilitySubject.pipe(
      filter(Boolean),
      map(() => this.dialog.open(this.modal, this.options)),
      switchMap((dialog) =>
        this.visibilitySubject.pipe(
          first((visible) => !visible),
          tap(() => dialog.close()),
          mergeWith(dialog.afterClosed()),
          filter(() => this.isOpen),
          tap(() => (this.isOpen = false)),
          tap(() => this.isOpenChange.emit(false))
        )
      )
    );

    // Subscribe for side effects
    this.subscription = dialog$.subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isOpen) {
      this.visibilitySubject.next(changes.isOpen.currentValue);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
