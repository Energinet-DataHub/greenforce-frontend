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
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

@Directive({
  selector: '[wattDrawerContent]',
})
export class WattDrawerContentDirective {
  constructor(public tpl: TemplateRef<unknown>) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
})
export class WattDrawerComponent {
  @ViewChild('templatePortalContent')
  templatePortalContent?: TemplateRef<unknown>;

  _isOpened = false;

  @Input() set opened(isOpened: boolean) {
    if (isOpened) {
      this._isOpened = true;

      if (this.content) {
        this.contentVcr?.createEmbeddedView(this.content.tpl);
      }
    } else {
      this._isOpened = false;

      this.contentVcr?.clear();
    }
  }
  get opened() {
    return this._isOpened;
  }

  @ContentChild(WattDrawerContentDirective)
  content?: WattDrawerContentDirective;

  @ViewChild('contentVcr', { read: ViewContainerRef, static: false })
  private contentVcr?: ViewContainerRef;
}
