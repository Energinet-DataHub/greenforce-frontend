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
  inject,
  input,
  output,
  Component,
  OnDestroy,
  viewChild,
  ElementRef,
  ChangeDetectionStrategy,
  signal,
  effect,
  afterRenderEffect,
  untracked,
  booleanAttribute,
} from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CdkTrapFocus, A11yModule } from '@angular/cdk/a11y';
import { MatSidenavModule } from '@angular/material/sidenav';

import { WattButtonComponent } from '../button';
import { WattSpinnerComponent } from '../spinner';

import { WattDrawerTopbarComponent } from './watt-drawer-topbar.component';
import { WattDrawerActionsComponent } from './watt-drawer-actions.component';
import { WattDrawerContentComponent } from './watt-drawer-content.component';
import { WattDrawerHeadingComponent } from './watt-drawer-heading.component';

export type WattDrawerSize = 'small' | 'normal' | 'large';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
  host: {
    '(document:click)': 'handleDocumentClick($event)',
    '(keydown.escape)': 'handleEscKeyPressed()',
  },
  imports: [A11yModule, MatSidenavModule, WattButtonComponent, WattSpinnerComponent],
})
export class WattDrawerComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  private overlayContainer = inject(OverlayContainer);
  private cdkTrapFocus = viewChild.required(CdkTrapFocus);
  private bypassClickCheck = false;
  private currentKey?: unknown;
  private writableIsOpen = signal(false);

  // Multiple drawers open at the same time is not allowed. This keeps track of
  // the currently opened drawer and closes it when a new drawer is opened.
  private static currentDrawer?: WattDrawerComponent;

  /** Used to adjust drawer size to best fit the content. */
  size = input<WattDrawerSize>('normal');

  /** Whether the drawer should open automatically. */
  autoOpen = input(false, { transform: booleanAttribute });

  /**
   * Used to track the current drawer when reusing the same drawer instance to
   * render different content. This is required when interactions outside the
   * drawer should result in updating the drawer's content instead of closing it.
   */
  // Transform input to a string (omitting input should not be the same as passing undefined)
  key = input(undefined, { transform: (value: unknown) => `${value}` });

  /** Whether the drawer should show a loading state. */
  loading = input(false);

  /** Emits whenever the drawer is fully closed. */
  closed = output<void>();

  /** Whether the drawer is open.  */
  isOpen = this.writableIsOpen.asReadonly();

  constructor() {
    effect(() => {
      untracked(() => {
        this.currentKey = this.key();
      });
    });

    afterRenderEffect(() => {
      this.key();
      // does untracked matter?
      untracked(() => {
        if (this.autoOpen()) {
          this.open();
        }
      });
    });
  }

  /** @ignore */
  handleDocumentClick(event: MouseEvent) {
    const shouldClose = this.key() === undefined || this.key() === this.currentKey;

    this.currentKey = this.key();

    // Prevent closing when the click triggered a call to `open`
    if (this.bypassClickCheck) return;

    // Check if the click originated from within the drawer element
    const isClickInside = this.elementRef.nativeElement.contains(event.target);
    if (isClickInside) return;

    // Check if the click originated from within an overlay (such as a modal)
    const overlayContainerEl = this.overlayContainer.getContainerElement();
    const isOverlayClick = overlayContainerEl.contains(event.target as Node);
    if (isOverlayClick) return;

    if (shouldClose) {
      this.close();
      this.currentKey = undefined;
    } else {
      this.open();
    }
  }

  /** @ignore */
  handleEscKeyPressed() {
    this.close();
  }

  /** @ignore */
  ngOnDestroy(): void {
    if (WattDrawerComponent.currentDrawer === this) {
      WattDrawerComponent.currentDrawer = undefined;
    }
  }

  /** Opens the drawer. Subsequent calls are ignored while the drawer is opened. */
  open() {
    // Prevent tracking drawer signals when open is triggered in a reactive context
    untracked(() => {
      // Trap focus whenever open is called. This doesn't work on the
      // initial call (when first opening the drawer), but this is
      // handled by the autoFocus property on mat-drawer.
      this.cdkTrapFocus().focusTrap.focusInitialElementWhenReady();

      // Disable click outside check until the current event loop is finished.
      // This might seem hackish, but the order of execution is stable here.
      // Also prevents an issue when the drawer is destroyed and then recreated,
      // causing the click outside check to trigger immediately if the drawer
      // is created and opened in response to a click event.
      this.bypassClickCheck = true;
      setTimeout(() => {
        this.bypassClickCheck = false;
      }, 0);

      if (this.isOpen()) return;
      WattDrawerComponent.currentDrawer?.close();
      WattDrawerComponent.currentDrawer = this;
      this.writableIsOpen.set(true);
    });
  }

  /** Closes the drawer. */
  close() {
    // Prevent tracking drawer signals when close is triggered in a reactive context
    untracked(() => {
      if (!this.isOpen()) return;
      WattDrawerComponent.currentDrawer = undefined;
      this.writableIsOpen.set(false);
    });
  }
}

export const WATT_DRAWER = [
  WattDrawerComponent,
  WattDrawerTopbarComponent,
  WattDrawerActionsComponent,
  WattDrawerContentComponent,
  WattDrawerHeadingComponent,
];
