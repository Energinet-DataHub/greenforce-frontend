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
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  OnDestroy,
  HostListener,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { WattDrawerTopbarComponent } from './watt-drawer-topbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
})
export class WattDrawerComponent implements AfterViewInit, OnDestroy {
  @Output()
  closed = new EventEmitter<void>();

  /**
   * Is the drawer opened
   */
  opened = false;

  /** @ignore */
  private destroy$ = new Subject<void>();

  /** @ignore */
  @ContentChild(WattDrawerTopbarComponent) topbar?: WattDrawerTopbarComponent;

  /** @ignore */
  @HostListener('window:keydown.escape')
  onEscKeyPressed() {
    this.close();
  }

  constructor(private cdr: ChangeDetectorRef) {}

  /** @ignore */
  ngAfterViewInit(): void {
    this.topbar?.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  /** @ignore */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the drawer. Subsequent calls are ignored while the drawer is opened.
   */
  open() {
    const isDrawerClosed = this.opened === false;

    if (isDrawerClosed) {
      this.opened = true;
      this.cdr.detectChanges();
    }
  }

  /**
   * Closes the drawer
   */
  close() {
    this.opened = false;
    this.closed.emit();
  }
}
