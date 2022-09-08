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
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
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
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { WattDrawerTopbarComponent } from './watt-drawer-topbar.component';

export type WattDrawerSize = 'small' | 'normal' | 'large';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
})
export class WattDrawerComponent implements AfterViewInit, OnDestroy {
  private static currentDrawer?: WattDrawerComponent;

  /** Used to adjust drawer size to best fit the content. */
  @Input()
  size: WattDrawerSize = 'normal';

  @Input()
  loading = false;

  @Output()
  closed = new EventEmitter<void>();

  @ViewChild(CdkTrapFocus)
  cdkTrapFocus!: CdkTrapFocus;

  /**
   * Is the drawer opened
   */
  opened = false;

  /** @ignore */
  bypassClickCheck = false;

  /** @ignore */
  private destroy$ = new Subject<void>();

  /** @ignore */
  @ContentChild(WattDrawerTopbarComponent) topbar?: WattDrawerTopbarComponent;

  /** @ignore */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Prevent closing when the click triggered a call to `open`
    if (this.bypassClickCheck) return;

    // Check if the click originated from within the drawer element
    const isClickInside = this.elementRef.nativeElement.contains(event.target);
    if (isClickInside) return;

    // Check if the click originated from within an overlay (such as a modal)
    const overlayContainerEl = this.overlayContainer.getContainerElement();
    const isOverlayClick = overlayContainerEl.contains(event.target as Node);
    if (isOverlayClick) return;

    // Click is allowed to close the drawer now
    this.close();
  }

  /** @ignore */
  @HostListener('keydown.escape')
  onEscKeyPressed() {
    this.close();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private overlayContainer: OverlayContainer
  ) {}

  /** @ignore */
  ngAfterViewInit(): void {
    this.topbar?.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.close());
  }

  /** @ignore */
  ngOnDestroy(): void {
    if (WattDrawerComponent.currentDrawer === this) {
      WattDrawerComponent.currentDrawer = undefined;
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the drawer. Subsequent calls are ignored while the drawer is opened.
   */
  open() {
    // Trap focus whenever open is called. This doesn't work on the
    // initial call (when first opening the drawer), but this is
    // handled by the autoFocus property on mat-drawer.
    this.cdkTrapFocus.focusTrap.focusInitialElementWhenReady();

    // Disable click outside check until the current event loop is finished.
    // This might seem hackish, but the order of execution is stable here.
    this.bypassClickCheck = true;
    setTimeout(() => {
      this.bypassClickCheck = false;
    }, 0);

    if (!this.opened) {
      WattDrawerComponent.currentDrawer?.close();
      WattDrawerComponent.currentDrawer = this;
      this.opened = true;
      this.cdr.detectChanges();
    }
  }

  /**
   * Closes the drawer
   */
  close() {
    if (this.opened) {
      WattDrawerComponent.currentDrawer = undefined;
      this.opened = false;
      this.closed.emit();
    }
  }
}
