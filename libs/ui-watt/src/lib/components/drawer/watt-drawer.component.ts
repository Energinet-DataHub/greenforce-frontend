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
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { WattDrawerContentDirective } from './watt-drawer-content.directive';

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
  @ContentChild(WattDrawerContentDirective)
  content?: WattDrawerContentDirective;

  /** @ignore */
  @ViewChild('contentVcr', { read: ViewContainerRef, static: false })
  private contentVcr?: ViewContainerRef;

  /** @ignore */
  private _isOpened = false;

  /** @ignore */
  @Input() set opened(isOpened: boolean) {
    if (isOpened && this.content && !this._isOpened) {
      this.contentVcr?.createEmbeddedView(this.content.tpl);
    }

    if(!isOpened && this._isOpened) {
      this.contentVcr?.clear();
      this.closed.emit();
    }

    this._isOpened = isOpened;
  }
  get opened() {
    return this._isOpened;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  /** @ignore */
  open() {
    this.opened = true;
    this.cdr.detectChanges();
  }

  /** @ignore */
  close() {
    this.opened = false;
    this.cdr.detectChanges();
  }
}
