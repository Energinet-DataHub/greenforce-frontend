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
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, filter, map, mergeWith, switchMap, tap } from 'rxjs';

export type WattModalSize = 'small' | 'normal' | 'large';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-modal',
  styleUrls: ['./watt-modal.component.scss'],
  templateUrl: './watt-modal.component.html',
})
export class WattModalComponent implements OnChanges, AfterViewInit {
  /** @ignore */
  private visibilitySubject = new Subject<boolean>();

  @Input()
  size: WattModalSize = 'normal';

  @Input()
  isOpen = false;

  @Output()
  isOpenChange = new EventEmitter<boolean>();

  /** @ignore */
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isOpen) {
      this.visibilitySubject.next(changes.isOpen.currentValue);
    }
  }

  getWidth(): string {
    switch (this.size) {
      case 'small':
        return '36vw';
      case 'normal':
        return '500px';
      case 'large':
        return '700px';
    }
  }

  get options() {
    return {
      width: this.getWidth(),
    };
  }

  ngAfterViewInit(): void {
    const dialog$ = this.visibilitySubject.pipe(
      filter(Boolean),
      map(() => this.dialog.open(this.modal, this.options)),
      switchMap((dialog) =>
        this.visibilitySubject.pipe(
          tap(() => dialog.close()),
          mergeWith(dialog.afterClosed()),
          filter(() => this.isOpen),
          tap(() => (this.isOpen = false)),
          tap(() => this.isOpenChange.emit(false))
        )
      )
    );

    // Subscribe for side effects
    dialog$.subscribe();
  }
}
