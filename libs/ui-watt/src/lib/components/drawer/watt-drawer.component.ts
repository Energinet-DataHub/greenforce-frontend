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

import { WattDrawerTopbarComponent } from './watt-drawer-topbar.component';

export type WattDrawerSize = 'small' | 'normal' | 'large';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
})
export class WattDrawerComponent implements OnDestroy {
  private static currentDrawer?: WattDrawerComponent;

  /** Used to adjust drawer size to best fit the content. */
  @Input() size: WattDrawerSize = 'normal';

  /** Whether the drawer is open.  */
  @Input() isOpen = false;

  /** Whether the drawer should show a loading state.  */
  @Input() loading = false;

  /** Emits whenever the drawer is closed. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild(CdkTrapFocus)
  cdkTrapFocus!: CdkTrapFocus;

  /** @ignore */
  bypassClickCheck = false;

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
  ngOnDestroy(): void {
    if (WattDrawerComponent.currentDrawer === this) {
      WattDrawerComponent.currentDrawer = undefined;
    }
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

    if (!this.isOpen) {
      WattDrawerComponent.currentDrawer?.close();
      WattDrawerComponent.currentDrawer = this;
      this.isOpen = true;
      this.cdr.detectChanges();
    }
  }

  /**
   * Closes the drawer
   */
  close() {
    if (this.isOpen) {
      WattDrawerComponent.currentDrawer = undefined;
      this.isOpen = false;
      this.closed.emit();
    }
  }
}
