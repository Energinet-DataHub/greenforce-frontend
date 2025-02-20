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
  model,
  output,
  Component,
  OnDestroy,
  viewChild,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  signal,
  effect,
  afterRenderEffect,
  untracked,
  linkedSignal,
} from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CdkTrapFocus, A11yModule } from '@angular/cdk/a11y';
import { MatSidenavModule } from '@angular/material/sidenav';

import { WattButtonComponent } from '../button';
import { WattSpinnerComponent } from '../spinner';

import { WattCssCustomPropertiesService } from '../../utils/css-custom-properties.service';

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
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private overlayContainer = inject(OverlayContainer);
  private cssCustomPropertiesService = inject(WattCssCustomPropertiesService);
  private static currentDrawer?: WattDrawerComponent;

  /** Used to adjust drawer size to best fit the content. */
  size = input<WattDrawerSize>('normal');

  autoOpen = input<boolean>(false);

  key = input<unknown>();

  keyToClose = signal<unknown>(undefined);

  expKeyToClose = linkedSignal(this.key);

  /** Whether the drawer is open.  */
  isOpen = model(false);

  /** Whether the drawer should show a loading state.  */
  loading = input(false);

  /** Emits whenever the drawer is closed. */
  closed = output<void>();

  cdkTrapFocus = viewChild.required(CdkTrapFocus);

  /** @ignore */
  bypassClickCheck = false;

  private currentKey?: unknown;

  constructor() {
    effect((onCleanup) => {
      untracked(() => {
        this.currentKey = this.key();
      });
      onCleanup(() => {
        this.currentKey = undefined;
      });
    });
    afterRenderEffect(() => {
      this.key();
      untracked(() => {
        if (this.autoOpen()) {
          this.open();
        }
      });
    });
  }

  /** @ignore */
  handleDocumentClick(event: MouseEvent) {
    const shouldClose = this.key() === this.currentKey;
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

    console.log(shouldClose);
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

  /**
   * Opens the drawer. Subsequent calls are ignored while the drawer is opened.
   */
  open() {
    // Trap focus whenever open is called. This doesn't work on the
    // initial call (when first opening the drawer), but this is
    // handled by the autoFocus property on mat-drawer.
    this.cdkTrapFocus().focusTrap.focusInitialElementWhenReady();

    // Disable click outside check until the current event loop is finished.
    // This might seem hackish, but the order of execution is stable here.
    this.bypassClickCheck = true;
    setTimeout(() => {
      this.bypassClickCheck = false;
    }, 0);

    if (!this.isOpen()) {
      WattDrawerComponent.currentDrawer?.close();
      WattDrawerComponent.currentDrawer = this;
      this.isOpen.set(true);
      // this.cdr.detectChanges();

      const value = this.cssCustomPropertiesService.getPropertyValue(
        '--watt-toolbar-z-index-when-drawer-is-open'
      );

      this.cssCustomPropertiesService.setPropertyValue('--watt-toolbar-z-index', value);
    }
  }

  /**
   * Closes the drawer
   */
  close() {
    if (this.isOpen()) {
      WattDrawerComponent.currentDrawer = undefined;
      this.isOpen.set(false);

      const value = this.cssCustomPropertiesService.getPropertyValue(
        '--watt-toolbar-z-index-when-drawer-is-closed'
      );

      this.cssCustomPropertiesService.setPropertyValue('--watt-toolbar-z-index', value);
    }
  }
}

export const WATT_DRAWER = [
  WattDrawerComponent,
  WattDrawerTopbarComponent,
  WattDrawerActionsComponent,
  WattDrawerContentComponent,
  WattDrawerHeadingComponent,
];
