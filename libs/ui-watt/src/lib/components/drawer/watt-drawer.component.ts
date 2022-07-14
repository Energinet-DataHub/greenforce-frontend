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
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { WattDrawerContentDirective } from './watt-drawer-content.directive';
import { WattDrawerTopBarDirective } from './watt-drawer-top-bar.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
})
export class WattDrawerComponent {
  @Output()
  closed = new EventEmitter<void>();

  /** @ignore */
  @ContentChild(WattDrawerTopBarDirective)
  topBar?: WattDrawerTopBarDirective;

  /** @ignore */
  @ContentChild(WattDrawerContentDirective)
  content?: WattDrawerContentDirective;

  /** @ignore */
  @ViewChild('topBarVcr', { read: ViewContainerRef, static: false })
  private topBarVcr?: ViewContainerRef;

  /** @ignore */
  @ViewChild('contentVcr', { read: ViewContainerRef, static: false })
  private contentVcr?: ViewContainerRef;

  /** @ignore */
  private areViewsCreated = false;

  /** @ignore */
  opened = false;

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Opens the drawer. Subsequent calls are ignored while the drawer is opened.
   */
  open() {
    this.opened = true;

    this.createEmbeddedViews();
    this.cdr.detectChanges();
  }

  /**
   * Closes the drawer
   */
  close() {
    this.opened = false;

    this.closed.emit();

    this.clearEmbeddedViews();
    this.cdr.detectChanges();
  }

  /** @ignore */
  private createEmbeddedViews(): void {
    if (!this.areViewsCreated) {
      this.areViewsCreated = true;

      this.content?.tpl &&
        this.contentVcr?.createEmbeddedView(this.content.tpl);
      this.topBar?.tpl && this.topBarVcr?.createEmbeddedView(this.topBar.tpl);
    }
  }

  /** @ignore */
  private clearEmbeddedViews(): void {
    if (this.areViewsCreated) {
      this.areViewsCreated = false;

      this.topBarVcr?.clear();
      this.contentVcr?.clear();
    }
  }
}
