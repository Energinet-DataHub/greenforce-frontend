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
  untracked,
  booleanAttribute,
  contentChild,
  effect,
} from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CdkTrapFocus, A11yModule } from '@angular/cdk/a11y';
import { MatSidenavModule } from '@angular/material/sidenav';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { WattDrawerTopbarComponent } from './watt-drawer-topbar.component';
import { WattDrawerActionsComponent } from './watt-drawer-actions.component';
import { WattDrawerContentComponent } from './watt-drawer-content.component';
import { WattDrawerHeadingComponent } from './watt-drawer-heading.component';

export type WattDrawerSize = 'small' | 'normal' | 'large';

const APPEAR_ANIMATION_DELAY = 250;
const APPEAR_ANIMATION_FRAMES = {
  transform: ['translateX(30px)', 'translateX(0)'],
  opacity: ['0', '1'],
};

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
  private content = contentChild(WattDrawerContentComponent, { read: ElementRef });
  private heading = contentChild(WattDrawerHeadingComponent, { read: ElementRef });
  private topBar = contentChild(WattDrawerTopbarComponent, { read: ElementRef });
  private cdkTrapFocus = viewChild.required(CdkTrapFocus);
  private bypassClickCheck = false;
  private writableIsOpen = signal(false);

  // Multiple drawers open at the same time are not allowed. This keeps track of
  // the currently opened drawer and closes it when a new drawer is opened.
  private static currentDrawer?: WattDrawerComponent;

  /** Used to adjust drawer size to best fit the content. */
  size = input<WattDrawerSize>('normal');

  /**
   * Whether the drawer should open automatically. If `key` is provided and
   * `autoOpen` is true, the drawer will open every time the key changes.
   */
  autoOpen = input(false, { transform: booleanAttribute });

  /**
   * Used to track the current drawer when reusing the same drawer instance to
   * render different content. This is required when interactions outside the
   * drawer should result in updating the drawer's content instead of closing it.
   */
  key = input<unknown>();

  /** Whether the drawer should show a loading state. */
  loading = input(false);

  /** Adds a brief animation to indicate that the content has changed. */
  animateOnKeyChange = input(false);

  /** Emits whenever the drawer is fully closed. */
  closed = output<void>();

  /** Whether the drawer is open.  */
  isOpen = this.writableIsOpen.asReadonly();

  constructor() {
    effect(() => {
      this.key();
      if (this.autoOpen()) this.open();
      if (!this.animateOnKeyChange()) return;
      untracked(() => {
        if (!this.isOpen()) return;
        this.content()?.nativeElement.animate(APPEAR_ANIMATION_FRAMES, APPEAR_ANIMATION_DELAY);
        this.heading()?.nativeElement.animate(APPEAR_ANIMATION_FRAMES, APPEAR_ANIMATION_DELAY);
        this.topBar()?.nativeElement.animate(APPEAR_ANIMATION_FRAMES, APPEAR_ANIMATION_DELAY);
      });
    });

    // Who doesn't love a good workaround, right?
    // Let's make the drawer resize itself whenever the `size` input changes.
    //
    // The `mat-drawer` component offers the `autosize` input for this.
    // However, it is specifically mentioned that this options should be used at own risk,
    // as it could cause performance issues.
    // See: https://material.angular.dev/components/sidenav/overview#resizing-an-open-sidenav
    //
    // So to work around this, a simple `resize` event is dispatched whenever the `size` input changes.
    // This works because `mat-drawer` uses `ViewportRuler` from `@angular/cdk/scrolling`
    // (see https://github.com/angular/components/blob/19.2.1/src/material/sidenav/drawer.ts#L811-L816)
    // to listen to `resize` events and re-calculates margins applied to the drawer content
    // (see https://github.com/angular/components/blob/20.0.0-rc.2/src/cdk/scrolling/viewport-ruler.ts#L50-L53).
    effect(() => {
      this.size();

      document.dispatchEvent(new Event('resize', { bubbles: true }));
    });
  }

  /** @ignore */
  handleDocumentClick(event: MouseEvent) {
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

    // Without `untracked`, if this is called in a reactive context (such as an `effect`),
    // it will be triggered twice due to `isOpen` being tracked and immediately updated.
    if (untracked(this.isOpen)) return;
    WattDrawerComponent.currentDrawer?.close();
    WattDrawerComponent.currentDrawer = this;
    this.writableIsOpen.set(true);
  }

  /** Closes the drawer. */
  close() {
    if (!untracked(this.isOpen)) return;
    WattDrawerComponent.currentDrawer = undefined;
    this.writableIsOpen.set(false);
  }
}

export const WATT_DRAWER = [
  WattDrawerComponent,
  WattDrawerTopbarComponent,
  WattDrawerActionsComponent,
  WattDrawerContentComponent,
  WattDrawerHeadingComponent,
];
